from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, Landlord, Property, Unit, Tenant, Payment
from sqlalchemy import func
import os
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime


app = Flask(__name__)
database_url = os.environ.get('DATABASE_URL')


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
            landlord_id=int(data['landlord_id'])
        )
        db.session.add(property)
        db.session.commit()
        return property.to_dict(), 201

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
        return property.to_dict(), 200

api.add_resource(Properties, '/properties', '/properties/<int:property_id>')

class Tenants(Resource):
    def get(self, tenant_id=None):

        if tenant_id:
            tenant = Tenant.query.get_or_404(tenant_id)
            return make_response(
                jsonify(tenant.to_dict()),
                200
            )

        # SEARCH TENANTS FUNCTIONALITY
        search = request.args.get('search')
        query = Tenant.query

        if search:
            query = query.filter(
                Tenant.name.ilike(f'%{search}%') |
                Tenant.email.ilike(f'%{search}%') |
                Tenant.phone.ilike(f'%{search}%')
            )
        tenants = query.all()
        return make_response(
            jsonify([t.to_dict() for t in tenants]),
            200
        )

        
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

        return {"message": "Tenant deleted successfully"}, 200

api.add_resource(Tenants, '/tenants', '/tenants/<int:tenant_id>')


class Units(Resource):
    def get(self, unit_id=None):

        if unit_id:
            unit = Unit.query.get_or_404(unit_id)
            return make_response(jsonify(unit.to_dict()), 200)

        # SEARCH & FILTER
        search = request.args.get('search')
        property_id = request.args.get('property_id')

        query = Unit.query


        if property_id:
            query = query.filter(Unit.property_id == property_id)

        # SEARCH FUNCTIONALITY
        if search:
            query = query.filter(
                Unit.unit_number.ilike(f"%{search}%") | Unit.status.ilike(f"%{search}%") 
            )

        units = query.all()
        return make_response(
            jsonify([u.to_dict() for u in units]),
            200
        )

        
    def post(self):
        move_in_date = None
        move_out_date = None
        
        if request.form.get('move_in_date'):
            move_in_date = datetime.strptime(request.form['move_in_date'], '%Y-%m-%d').date()
        
        if request.form.get('move_out_date'):
            move_out_date = datetime.strptime(request.form['move_out_date'], '%Y-%m-%d').date()

        unit = Unit(
            unit_number=request.form['unit_number'],
            rent_amount=request.form.get('rent_amount'),
            status=request.form.get('status', 'vacant'),
            tenant_id=request.form.get('tenant_id'),
            property_id=request.form['property_id'],
            move_in_date=move_in_date,
            move_out_date=move_out_date
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
        if request.form.get('move_in_date'):
            unit.move_in_date = datetime.strptime(request.form['move_in_date'], '%Y-%m-%d').date()
        elif 'move_in_date' in request.form and request.form['move_in_date'] == '':  
            unit.move_in_date = None
        
        if request.form.get('move_out_date'):
            unit.move_out_date = datetime.strptime(request.form['move_out_date'], '%Y-%m-%d').date()
        elif 'move_out_date' in request.form and request.form['move_out_date'] == '':  
            unit.move_out_date = None

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
            tenant_id=data['tenant_id'], 
            amount=data['amount'],
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

class DashboardStats(Resource):
    def get(self):
        landlord_id = request.args.get('landlord_id', type=int)

        if landlord_id:
            total_properties = Property.query.filter_by(landlord_id=landlord_id).count()
            total_units = db.session.query(Unit).join(Property).filter(Property.landlord_id==landlord_id).count()
            occupied_units = db.session.query(Unit).join(Property).filter(Property.landlord_id==landlord_id, Unit.status=='occupied').count()
            vacant_units = db.session.query(Unit).join(Property).filter(Property.landlord_id==landlord_id, Unit.status=='vacant').count()
            total_tenants = db.session.query(Unit.tenant_id).join(Property).filter(Property.landlord_id==landlord_id, Unit.tenant_id != None).distinct().count()
            payments = db.session.query(Payment).join(Tenant).join(Unit).join(Property).filter(Property.landlord_id==landlord_id).all()
            total_payments = len(payments)
            total_revenue = sum([p.amount for p in payments if p.status == 'completed'])
            all_payments = db.session.query(Payment).join(Tenant).join(Unit).join(Property).filter(Property.landlord_id==landlord_id).all()
            all_payments_sorted = sorted(all_payments, key=lambda p: p.paid_date, reverse=True)
            recent_payments_query = all_payments_sorted[:5]
        
        else:
            total_properties = Property.query.count()
            total_units = Unit.query.count()
            occupied_units = Unit.query.filter_by(status='occupied').count()
            vacant_units = Unit.query.filter_by(status='vacant').count()
            total_tenants = Tenant.query.count()
            total_payments = Payment.query.count()
            completed_payments = Payment.query.filter(Payment.status == 'completed').all()
            total_revenue = sum([p.amount for p in completed_payments]) if completed_payments else 0
            completed_payments_sorted = sorted(completed_payments, key=lambda p: p.paid_date, reverse=True)
            recent_payments_query = completed_payments_sorted[:5]

        recent_payments = []
        for p in recent_payments_query:
            tenant = Tenant.query.get(p.tenant_id)
            recent_payments.append({
                "id": p.id,
                "tenant_id": p.tenant_id,
                "tenant_name": tenant.name if tenant else None,
                "amount": float(p.amount),
                "paid_date": str(p.paid_date) if p.paid_date else None,
                "status": p.status
            })

        stats = {
            "total_properties": total_properties,
            "total_units": total_units,
            "occupied_units": occupied_units,
            "vacant_units": vacant_units,
            "total_tenants": total_tenants,
            "total_payments": total_payments,
            "total_revenue": float(total_revenue),
            "recent_payments": recent_payments
        }

        return make_response(jsonify(stats), 200)


api.add_resource(DashboardStats, '/dashboard/stats')

class Register(Resource):
    def post(self):
        data = request.form
        
        # Check if email already exists
        existing_landlord = Landlord.query.filter_by(email=data['email']).first()
        if existing_landlord:
            return make_response(
                jsonify({"error": "Email already registered"}),
                400
            )
        
        # Create new landlord
        landlord = Landlord(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(landlord)
        db.session.commit()
        
        return make_response(
            jsonify({
                "message": "Registration successful",
                "landlord": landlord.to_dict()
            }),
            201
        )

api.add_resource(Register, '/register')
class Logout(Resource):
    def post(self):
        return {"message": "Logout successful"}, 200

api.add_resource(Logout, '/logout')


class Login(Resource):
    def post(self):
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            return make_response(
                jsonify({"error": "Email and password required"}),
                400
            )

        landlord = Landlord.query.filter_by(email=email).first()

        if not landlord or not check_password_hash(landlord.password_hash, password):
            return make_response(
                jsonify({"error": "Invalid credentials"}),
                401
            )

        return make_response(
            jsonify({
                "message": "Login successful",
                "landlord": landlord.to_dict()
            }),
            200
        )

api.add_resource(Login, '/login')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
