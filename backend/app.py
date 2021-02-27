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
api.add_resource(resources.stripe_check, '/stripe')
api.add_resource(resources.create_order, '/createOrder')
api.add_resource(resources.send_order, '/orders')
api.add_resource(resources.complete_order, '/orders/fill')


if __name__ == "__main__":
    app.run(debug=True)