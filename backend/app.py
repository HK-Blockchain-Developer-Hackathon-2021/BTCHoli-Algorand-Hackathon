from flask import Flask
from flask_restful import Api
from flask_mongoengine import MongoEngine
from flask import jsonify
from flask_pymongo import pymongo
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
client = pymongo.MongoClient("mongodb+srv://algorand:algorand@cluster0.v886j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.algorand

import resources

api = Api(app)
api.add_resource(resources.get_bond_data, '/bondForm')
api.add_resource(resources.give_bond_data, '/getForm')
api.add_resource(resources.update_bond, '/updateForm')
api.add_resource(resources.purchase_bond, '/purchaseBond')
