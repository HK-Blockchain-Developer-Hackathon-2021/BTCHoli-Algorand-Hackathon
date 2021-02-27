from flask import Flask
from flask_restful import Api
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)

import resources

api = Api(app)
api.add_resource(resources.get_bond_data, '/bondForm')
api.add_resource(resources.give_bond_data, '/getForm')
api.add_resource(resources.update_bond, '/updateForm')
api.add_resource(resources.purchase_bond, '/purchaseBond')
api.add_resource(resources.get_profile, '/getProfile')

if __name__ == "__main__":
    app.run(debug=True)