import numpy as np
from flask_restful import Resource, reqparse
from datetime import datetime

from blockchain.config import USDT_asset_id
from db_connection import db
from blockchain.blockchain import create_asset, distribute_dividends, transfer_asset, activate_account
from blockchain.utils import get_number_of_seconds
import json
from bson.objectid import ObjectId
from blockchain.utils import call_repeatedly

parser = reqparse.RequestParser()
parser.add_argument('bondName', help='This field cannot be blank', required=True)
parser.add_argument('couponRate', help='This field cannot be blank', required=True)
parser.add_argument('issuerName', help='This field cannot be blank', required=True)
parser.add_argument('faceValue', help='This field cannot be blank', required=True)
parser.add_argument('issueDate', help='This field cannot be blank', required=True)
parser.add_argument('maturityDate', help='This field cannot be blank', required=True)
parser.add_argument('numberOfAnnualPayments', help='This field cannot be blank', required=True)
parser.add_argument('natureOfBond', help='This field cannot be blank', required=True)
parser.add_argument('issueSize', help='This field cannot be blank', required=True)
parser.add_argument('frequency', help='This field cannot be blank', required=True)

parser_update = reqparse.RequestParser()
parser_update.add_argument('bondId', help='This field cannot be blank', required=True)

parser_trans = reqparse.RequestParser()
parser_trans.add_argument('userId', help='This field cannot be blank', required=True)
parser_trans.add_argument('assetId', help='This field cannot be blank', required=True)
parser_trans.add_argument('amount', help='This field cannot be blank', required=True)

parser_profile = reqparse.RequestParser()
parser_profile.add_argument('userId', help='This field cannot be blank', required=True)


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

        for cc in range(0, len(cursor)):
            cursor[cc]['_id'] = str(cursor[cc]['_id'])
            cursor[cc]['created_at'] = str(cursor[cc]['created_at'])
            cursor[cc]['symbol'] = cursor[cc]['bond_name'][:3].upper()

        return {
            "bonds": cursor
        }


class update_bond(Resource):
    def put(self):
        form = db.form
        data = parser_update.parse_args()
        id = ObjectId(data['bondId'])
        cursor = form.find_one({"_id": id})
        contract_id = create_asset(cursor)
        form.update({"_id": id}, {"$set": {"is_signed": True, "asset_id": contract_id}})

        asset_info = form.find_one({"_id": id})
        repeat_seconds = get_number_of_seconds(asset_info['unit'], asset_info['frequency'])
        print("Frequency: ", repeat_seconds)
        call_repeatedly(repeat_seconds, distribute_dividends, asset_info)

        return {
            "message": "done",
            "asset_id": contract_id
        }


class purchase_bond(Resource):
    def post(self):
        tx = db.transaction
        form = db.form
        data = parser_trans.parse_args()
        bond = form.find_one({"asset_id": int(data['assetId'])})
        user = db.user.find_one({"mnemonic": data['userId']})

        tokens = (int(data['amount']) / bond['face_value']) * bond['issue_size']

        activate_account(int(data['assetId']), data['userId'])
        activate_account(USDT_asset_id, data['userId'])
        transfer_asset(int(data['assetId']), data['userId'], tokens)

        tx_info = {
            'user_id': user['_id'],
            'asset_id': int(data['assetId']),
            'amount': int(data['amount']),
            'tokens': tokens,
            'action': "BUY",
            'created_at': datetime.now()
        }
        tx_id = tx.insert_one(tx_info)

        return {
            "message": "done"
        }


class get_profile(Resource):
    def get(self):
        data = parser_profile.parse_args()
        user_memonic = data['userId']
        user = db.user.find_one({'mnemonic': user_memonic})
        transactions = [tx for tx in db.transaction.find({'user_id': user['_id']})]
        for tx in transactions:
            tx['_id'] = str(tx['_id'])
            del tx['user_id']
            tx['created_at'] = str(tx['created_at'])
            tx['token'] = db.form.find_one({'asset_id': int(tx['asset_id'])})['bond_name'][:3].upper()
            tx['qty'] = tx['tokens']
        net_portfolio = sum(tx['amount'] for tx in transactions)
        difference = (np.random.uniform(0, 5) / 100)
        net_difference = difference if np.random.uniform(0, 1) > 0.5 else difference * (-1)
        holdings = []
        percentage_holdings = []
        asset_ids = set([tx['asset_id'] for tx in transactions])
        for asset_id in asset_ids:
            asset_txs = [tx for tx in transactions if tx['asset_id'] == asset_id]
            asset_symbol = db.form.find_one({'asset_id': int(asset_id)})['bond_name'][:3].upper()
            amount = sum([tx['amount'] for tx in asset_txs if tx['action'] == 'BUY']) - \
                     sum([tx['amount'] for tx in asset_txs if tx['action'] == 'SELL'])
            qty = sum([tx['tokens'] for tx in asset_txs if tx['action'] == 'BUY']) - \
                  sum([tx['tokens'] for tx in asset_txs if tx['action'] == 'SELL'])
            holdings.append({
                'token': asset_symbol,
                'amount': amount,
                'qty': qty
            })
            percentage_holdings.append({'symbol': asset_symbol, 'percentage': amount / net_portfolio})

        dividends = sum([tx['amount'] for tx in db.dividends.find({}) if tx['user_id'] == user_memonic])

        return {
            'transactions': list(transactions),
            'netPortfolio': net_portfolio * (1 + net_difference),
            'holdings': holdings,
            'percentage_holdings': percentage_holdings,
            'dividends': dividends
        }
