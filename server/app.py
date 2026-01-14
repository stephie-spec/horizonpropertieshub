from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash
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

api.add_resource(Home, '/')

class LandlordList(Resource):
    def get(self, landlord_id=None):
        if landlord_id:
            landlord = Landlord.query.get_or_404(landlord_id)
            return make_response(jsonify(landlord.to_dict()), 200)

        landlords = Landlord.query.all()
        return make_response(jsonify([l.to_dict() for l in landlords]), 200)

    def post(self):
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')  

        if not name or not email:
            return make_response(jsonify({"error": "Name and email are required"}), 400)

        landlord = Landlord(
            name=name,
            email=email,
            phone=phone,
            password_hash=generate_password_hash(password) if password else None
        )

        db.session.add(landlord)
        db.session.commit()

        return make_response(jsonify({
            "message": "Landlord created successfully",
            "landlord": landlord.to_dict()
        }), 201)

    def put(self, landlord_id):
        landlord = Landlord.query.get_or_404(landlord_id)
        landlord.name = request.form.get('name', landlord.name)
        landlord.phone = request.form.get('phone', landlord.phone)
        landlord.email = request.form.get('email', landlord.email)

        db.session.commit()
        return make_response(jsonify({
            "message": "Landlord updated successfully",
            "landlord": landlord.to_dict()
        }), 200)

    def delete(self, landlord_id):
        landlord = Landlord.query.get_or_404(landlord_id)
        db.session.delete(landlord)
        db.session.commit()
        return make_response(jsonify({"message": "Landlord deleted successfully"}), 200)


api.add_resource(LandlordList, '/landlords', '/landlords/<int:landlord_id>')


class Properties(Resource):
    def get(self, property_id=None):
        if property_id:
            prop = Property.query.get_or_404(property_id)
            return make_response(jsonify(prop.to_dict()), 200)

        props = Property.query.all()
        return make_response(jsonify([p.to_dict() for p in props]), 200)

    def post(self):
        name = request.form.get('name')
        location = request.form.get('location')
        description = request.form.get('description')
        landlord_id = request.form.get('landlord_id')

        if not landlord_id or not Landlord.query.get(int(landlord_id)):
            return make_response(jsonify({"error": "Valid landlord_id is required"}), 400)

        prop = Property(
            name=name,
            location=location,
            description=description,
            landlord_id=int(landlord_id)
        )

        db.session.add(prop)
        db.session.commit()
        return make_response(jsonify({
            "message": "Property created successfully",
            "property": prop.to_dict()
        }), 201)

    def put(self, property_id):
        prop = Property.query.get_or_404(property_id)
        prop.name = request.form.get('name', prop.name)
        prop.location = request.form.get('location', prop.location)
        prop.description = request.form.get('description', prop.description)
        landlord_id = request.form.get('landlord_id')
        if landlord_id:
            prop.landlord_id = int(landlord_id)

        db.session.commit()
        return make_response(jsonify({
            "message": "Property updated successfully",
            "property": prop.to_dict()
        }), 200)

    def delete(self, property_id):
        prop = Property.query.get_or_404(property_id)
        db.session.delete(prop)
        db.session.commit()
        return make_response(jsonify({"message": "Property deleted successfully"}), 200)


api.add_resource(Properties, '/properties', '/properties/<int:property_id>')


class Tenants(Resource):
    def get(self, tenant_id=None):
        if tenant_id:
            tenant = Tenant.query.get_or_404(tenant_id)
            response = make_response(
                jsonify(tenant.to_dict()),
                200,
            )
            return response
        else:
            tenants = Tenant.query.all()
            response = make_response(
                jsonify([t.to_dict() for t in tenants]),
                200,
            )
            return response
       
    def post(self):
        tenant = Tenant(
            id=request.form['id'],
            name=request.form['name'],
            phone=request.form.get('phone'),
            email=request.form.get('email'),
            id_number=request.form.get('id_number')
            # 'created_at' will be included when to_dict() runs
        )
        
        db.session.add(tenant)
        db.session.commit()

        response_body = {
            "message": "Tenant created successfully",
            "tenant": tenant.to_dict()
        }
        response = make_response(
            jsonify(response_body),
            201,
        )
        return response
    
    def put(self, tenant_id):
        tenant = Tenant.query.get_or_404(tenant_id)
        tenant.name = request.form.get('name', tenant.name)
        tenant.phone = request.form.get('phone', tenant.phone)
        tenant.email = request.form.get('email', tenant.email)
        tenant.id_number = request.form.get('id_number', tenant.id_number)

        db.session.commit()

        response_body = {
            "message": "Tenant updated successfully",
            "tenant": tenant.to_dict()
        }
        response = make_response(
            jsonify(response_body),
            200,
        )

        return response
    
    def delete(self, tenant_id):
        tenant = Tenant.query.get_or_404(tenant_id)
        db.session.delete(tenant)
        db.session.commit()

        response_body = {
            "message": "Tenant deleted successfully"
        }
        return jsonify(response_body), 200


class Units(Resource):
    def get(self, unit_id=None):
        if unit_id:
            unit = Unit.query.get_or_404(unit_id)
            response = make_response(
                jsonify(unit.to_dict()),
                200,
            )
            return response
        else:
            units = Unit.query.all()
            response_body = [u.to_dict() for u in units]
            response = make_response(
                jsonify(response_body),
                200,
            )
            return response
        
    def post(self):
        unit = Unit(
            id=request.form['id'],
            unit_number=request.form['unit_number'],
            rent_amount=request.form.get('rent_amount'),
            status=request.form.get('status', 'vacant'),
            tenant_id=request.form.get('tenant_id'),
            property_id=request.form['property_id'],
            move_in_date=request.form.get('move_in_date'),
            move_out_date=request.form.get('move_out_date')
        )

        db.session.add(unit)
        db.session.commit()

        response_body = {
            "message": "Unit created successfully",
            "unit": unit.to_dict()
        }
        response = make_response(
            jsonify(response_body),
            201,
        )
        return response
    
    def put(self, unit_id):
        unit = Unit.query.get_or_404(unit_id)
        unit.unit_number = request.form.get('unit_number', unit.unit_number)
        unit.rent_amount = request.form.get('rent_amount', unit.rent_amount)
        unit.status = request.form.get('status', unit.status)
        unit.tenant_id = request.form.get('tenant_id', unit.tenant_id)
        unit.property_id = request.form.get('property_id', unit.property_id)
        unit.move_in_date = request.form.get('move_in_date', unit.move_in_date)
        unit.move_out_date = request.form.get('move_out_date', unit.move_out_date)

        db.session.commit()

        response_body = {
            "message": "Unit updated successfully",
            "unit": unit.to_dict()
        }
        response = make_response(
            jsonify(response_body),
            200,
        )
        return response
    
    def delete(self, unit_id):
        unit = Unit.query.get_or_404(unit_id)

        db.session.delete(unit)
        db.session.commit()

        response_body = {
            "message": "Unit deleted successfully"
        }
        response = make_response(
            jsonify(response_body),
            200,
        )
        return response


if __name__ == "__main__":
    app.run(port=5555, debug=True)
