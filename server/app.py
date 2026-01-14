from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, Landlord, Property, Unit, Tenant, Payment
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

# Landlords
class Landlords(Resource):
    def get(self, landlord_id=None):
        if landlord_id:
            landlord = Landlord.query.get_or_404(landlord_id)
            return landlord.to_dict(), 200
        return [l.to_dict() for l in Landlord.query.all()], 200

    def post(self):
        data = request.form
        landlord = Landlord(
            name=data['name'],
            phone=data.get('phone'),
            email=data['email'],
            password_hash=data.get('password_hash')
        )
        db.session.add(landlord)
        db.session.commit()
        return {"message": "Landlord created", "landlord": landlord.to_dict()}, 201

    def put(self, landlord_id):
        landlord = Landlord.query.get_or_404(landlord_id)
        data = request.form
        landlord.name = data.get('name', landlord.name)
        landlord.phone = data.get('phone', landlord.phone)
        landlord.email = data.get('email', landlord.email)
        landlord.password_hash = data.get('password_hash', landlord.password_hash)
        db.session.commit()
        return {"message": "Landlord updated", "landlord": landlord.to_dict()}, 200

    def delete(self, landlord_id):
        landlord = Landlord.query.get_or_404(landlord_id)
        db.session.delete(landlord)
        db.session.commit()
        return {"message": "Landlord deleted"}, 200

api.add_resource(Landlords, '/landlords', '/landlords/<int:landlord_id>')

# Properties
class Properties(Resource):
    def get(self, property_id=None):
        if property_id:
            property = Property.query.get_or_404(property_id)
            return property.to_dict(), 200
        return [p.to_dict() for p in Property.query.all()], 200

    def post(self):
        data = request.form
        property = Property(
            name=data['name'],
            location=data.get('location'),
            description=data.get('description'),
            landlord_id=data['landlord_id']
        )
        db.session.add(property)
        db.session.commit()
        return {"message": "Property created", "property": property.to_dict()}, 201

    def put(self, property_id):
        property = Property.query.get_or_404(property_id)
        data = request.form
        property.name = data.get('name', property.name)
        property.location = data.get('location', property.location)
        property.description = data.get('description', property.description)
        property.landlord_id = data.get('landlord_id', property.landlord_id)
        db.session.commit()
        return {"message": "Property updated", "property": property.to_dict()}, 200

    def delete(self, property_id):
        property = Property.query.get_or_404(property_id)
        db.session.delete(property)
        db.session.commit()
        return {"message": "Property deleted"}, 200

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

api.add_resource(Tenants, '/tenants', '/tenants/<int:tenant_id>')


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

api.add_resource(Units, '/units', '/units/<int:unit_id>')


# Payments
class Payments(Resource):
    def get(self, payment_id=None):
        if payment_id:
            payment = Payment.query.get_or_404(payment_id)
            return make_response(jsonify(payment.to_dict()), 200)

        payments = Payment.query.all()
        return make_response(
            jsonify([p.to_dict() for p in payments]),
            200
        )

    def post(self):
        data = request.form

        payment = Payment(
            tenant_id=data.get('tenant_id'),
            amount=data.get('amount'),
            mpesa_code=data.get('mpesa_code'),
            status='paid'
        )

        db.session.add(payment)
        db.session.commit()

        return make_response(
            jsonify({
                "message": "Payment recorded successfully",
                "payment": payment.to_dict()
            }),
            201
        )

    def put(self, payment_id):
        payment = Payment.query.get_or_404(payment_id)

        payment.tenant_id = request.form.get('tenant_id', payment.tenant_id)
        payment.amount = request.form.get('amount', payment.amount)
        payment.status = request.form.get('status', payment.status)
        payment.mpesa_code = request.form.get('mpesa_code', payment.mpesa_code)

        db.session.commit()

        return make_response(
            jsonify({
                "message": "Payment updated successfully",
                "payment": payment.to_dict()
            }),
            200
        )

    def delete(self, payment_id):
        payment = Payment.query.get_or_404(payment_id)
        db.session.delete(payment)
        db.session.commit()

        return make_response(
            jsonify({"message": "Payment deleted successfully"}),
            200
        )
api.add_resource(Payments, '/payments', '/payments/<int:payment_id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)


