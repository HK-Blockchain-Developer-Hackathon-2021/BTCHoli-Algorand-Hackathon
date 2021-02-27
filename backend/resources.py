from flask_restful import Resource, reqparse
from datetime import datetime
from db_connection import db
from blockchain.blockchain import create_asset, distribute_dividends, transfer_asset, activate_account, p2p_order
from blockchain.utils import get_number_of_seconds
from bson.objectid import ObjectId
from blockchain.utils import call_repeatedly
from flask import request
import stripe
import json 

parser = reqparse.RequestParser()
parser.add_argument('bondName', help = 'This field cannot be blank', required = True)
parser.add_argument('couponRate', help = 'This field cannot be blank', required = True)
parser.add_argument('issuerName', help = 'This field cannot be blank', required = True)
parser.add_argument('faceValue', help = 'This field cannot be blank', required = True)
parser.add_argument('issueDate', help = 'This field cannot be blank', required = True)
parser.add_argument('maturityDate', help = 'This field cannot be blank', required = True)
parser.add_argument('numberOfAnnualPayments', help = 'This field cannot be blank', required = True)
parser.add_argument('natureOfBond', help = 'This field cannot be blank', required = True)
parser.add_argument('issueSize', help = 'This field cannot be blank', required = True)
parser.add_argument('frequency', help = 'This field cannot be blank', required = True)

parser_update = reqparse.RequestParser()
parser_update.add_argument('bondId', help = 'This field cannot be blank', required = True)

parser_trans = reqparse.RequestParser()
parser_trans.add_argument('userId', help = 'This field cannot be blank', required = True)
parser_trans.add_argument('assetId', help = 'This field cannot be blank', required = True)
parser_trans.add_argument('amount', help = 'This field cannot be blank', required = True)

parser_order = reqparse.RequestParser()
parser_order.add_argument('userId', help = 'This field cannot be blank', required = True)
parser_order.add_argument('assetId', help = 'This field cannot be blank', required = True)
parser_order.add_argument('tokenAmount', help = 'This field cannot be blank', required = True)
parser_order.add_argument('usdtAmount', help = 'This field cannot be blank', required = True)
parser_order.add_argument('type', help = 'This field cannot be blank', required = True)

parser_comp = reqparse.RequestParser()
parser_comp.add_argument('userId', help = 'This field cannot be blank', required = True)
parser_comp.add_argument('orderId', help = 'This field cannot be blank', required = True)


class get_bond_data(Resource):
    def post(self):
        form = db.form
        data = parser.parse_args()
        bond_info = {
            'bond_name': data['bondName'],
            'coupon_rate': int(data['couponRate']),
            'issuer_name': data['issuerName'],
            'face_value': int(data['faceValue']),
            'issue_date': data['issueDate'],
            'maturity_date': data['maturityDate'],
            'unit': int(data['numberOfAnnualPayments']),
            'frequency': data['frequency'],
            'nature_of_bond': data['natureOfBond'],
            'issue_size': int(data['issueSize']),
            'is_signed': False,
            'asset_id': None,
            'created_at': datetime.now()
        }
        bond_id = form.insert_one(bond_info)
        
        return {
            "message": "done"
        }

class give_bond_data(Resource):
    def get(self):
        form = db.form
        cursor = list(form.find({}))

        for cc in range (0,len(cursor)):
            cursor[cc]['_id'] = str(cursor[cc]['_id'])
            cursor[cc]['created_at'] = str(cursor[cc]['created_at'])
        
        return{
            "bonds": cursor
        }

class update_bond(Resource):
    def put(self):
        form = db.form
        data = parser_update.parse_args()
        id = ObjectId(data['bondId'])
        cursor = form.find_one({"_id":id})
        contract_id = create_asset(cursor)
        form.update({"_id":id},{"$set": { "is_signed" : True, "asset_id" : contract_id}})

        asset_info = form.find_one({"_id":id})
        repeat_seconds = get_number_of_seconds(asset_info['unit'], asset_info['frequency'])
        print("Frequency: ", repeat_seconds)
        call_repeatedly(repeat_seconds, distribute_dividends, asset_info)

        return{
            "message": "done",
            "asset_id": contract_id
        }

class stripe_check(Resource):
    def post(self):
        SECRET_KEY = "sk_test_51IP3SAISiEQTlbp6XG9ARetZmPB7AicRV7Ahxu98gkjmD2fmmOaFbdaXYm8Qxo7MvsvNhpZaqu2R0WfziuScKtLP00y2BAn9Hh"
        stripe.api_key=SECRET_KEY

        data = parser_trans.parse_args()
        
        try:
            info = stripe.Token.create(
                card={
                    "number": 4242424242424242,
                    "exp_month": 8,
                    "exp_year": 25,
                    "cvc": 565,
                })
            payment = stripe.Charge.create(
                    amount= int(data['amount'])*100,                 
                    currency='usd',
                    description='Airport Bond',
                    source=info['id']
                    )
            
            if payment['paid']:
                tx = create_transaction(data)
                return {
                    "transaction_id": tx,
                    "message": "done"
                }
            else:
                return "gand marao"
        except:
            return("ille")

class create_order(Resource):
    def post(self):
        data = parser_order.parse_args()

        order_info ={
            'user_id': data['userId'],
            'asset_id': data['assetId'],
            'token_amount': int(data['tokenAmount']),
            'usdt_amount': int(data['usdtAmount']),
            'type': data['type']
        }
        order_id = db.orders.insert(order_info)
        return{
            "message": "done"
        }

class send_order(Resource):
    def get(self):
        cursor = list(db.orders.find({}))

        for cc in range (0,len(cursor)):
            cursor[cc]['_id'] = str(cursor[cc]['_id'])

        return{
            "orders": cursor
        }

class complete_order(Resource):
    def get(self):
        data = parser_comp.parse_args()
        order_id = ObjectId(data['orderId'])
        order = dict(db.orders.find_one({'_id':order_id}))

        dict_r = {'usdt_amount': order['usdt_amount'], 'token_amount': order['token_amount'], 'asset_id': order['asset_id']}
        
        if order['type'] == "BUY":
            buyer = data['userId']
            seller = order['user_id']
            p2p_order(buyer, seller, dict_r)
        else:
            buyer = order['user_id']
            seller = data['userId']
            p2p_order(buyer, seller, dict_r)
            
        return{
            "message":"done"
        }

def create_transaction(data):
        bond = db.form.find_one({"asset_id":int(data['assetId'])})
        user = db.user.find_one({"mnemonic":data['userId']})

        tokens = (int(data['amount'])/bond['face_value'])*bond['issue_size']

        activate_account(int(data['assetId']), data['userId'])
        transfer_asset(int(data['assetId']), data['userId'], tokens)

        tx_info = {
            'user_id': user['_id'],
            'asset_id': int(data['assetId']),
            'amount': int(data['amount']),
            'tokens': tokens,
            'action': "BUY",
            'created_at': datetime.now()
        }
        tx = db.transaction.insert(tx_info)
        return(str(tx))