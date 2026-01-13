from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, Landlord, Property, Unit, Tenant, Payment, TenantPayment
import os

app = Flask(__name__)
os.makedirs(os.path.join(app.root_path, "instance"), exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(app.root_path, 'instance', 'horizonpropertieshub.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)


api = Api(app)

class Home(Resource):
    def get(self):
        response_dict = {
            "message": "Welcome to Horizon Properties API",
        }
        return make_response(response_dict, 200)

api.add_resource(Home, "/")

if __name__ == "__main__":
    app.run(port=5555, debug=True)
