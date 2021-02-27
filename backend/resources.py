from flask_restful import Resource, reqparse
from datetime import datetime
from app import db
from blockchain.blockchain import create_asset
import json 
from bson.objectid import ObjectId

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

parser_update = reqparse.RequestParser()
parser_update.add_argument('bondId', help = 'This field cannot be blank', required = True)

parser_update = reqparse.RequestParser()
parser_update.add_argument('bondId', help = 'This field cannot be blank', required = True)

class get_bond_data(Resource):
    def post(self):
        form = db.form
        data = parser.parse_args()
        bond_info = {
            'bond_name': data['bondName'],
            'coupon_rate': data['couponRate'],
            'issuer_name': data['issuerName'],
            'face_value': data['faceValue'],
            'issue_date': data['issueDate'],
            'maturity_date': data['maturityDate'],
            'number_of_annual_payments': data['numberOfAnnualPayments'],
            'nature_of_bond': data['natureOfBond'],
            'issue_size': int(data['issueSize']),
            'is_signed': False,
            'asset_id': None
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
            cursor[cc]['_id'] = str(cursor[0]['_id'])
        
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

        return{
            "message": "done",
            "asset_id": contract_id
        }


