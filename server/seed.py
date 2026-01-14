from app import app
from models import db, Landlord, Property, Unit, Tenant, Payment
from datetime import datetime, date
from werkzeug.security import generate_password_hash

def clear_data():
    with app.app_context():
        db.drop_all()
        db.create_all()
    print("Database cleared and tables recreated.")

def seed_data():
    with app.app_context():

        # Landlords
        landlords = [
            Landlord(name='John Kamau', phone='+254712345678', email='johnKamau@Yahoo.com',
                     password_hash=generate_password_hash('password123')),
            Landlord(name='Mary Wanjiru', phone='+254723456789', email='mary@gmail.com',
                     password_hash=generate_password_hash('password123')),
            Landlord(name='Peter Ochieng', phone='+254734567890', email='peter@gmail.com',
                     password_hash=generate_password_hash('password123')),
        ]
        db.session.add_all(landlords)
        db.session.commit()

        john = Landlord.query.filter_by(name='John Kamau').first()
        mary = Landlord.query.filter_by(name='Mary Wanjiru').first()
        peter = Landlord.query.filter_by(name='Peter Ochieng').first()

        # Properties
        properties = [
            Property(name='Skyline Apartments', location='Westlands, Nairobi',
                     description='Luxury apartments', landlord_id=john.id),
            Property(name='Green Valley Estate', location='Kilimani, Nairobi',
                     description='Family-friendly estate', landlord_id=john.id),
            Property(name='Ocean View Residences', location='Nyali, Mombasa',
                     description='Beachfront property', landlord_id=mary.id),
            Property(name='Highland Towers', location='Karen, Nairobi',
                     description='Premium high-rise', landlord_id=peter.id),
        ]
        db.session.add_all(properties)
        db.session.commit()

        skyline = Property.query.filter_by(name='Skyline Apartments').first()

        # Tenants
        tenants = [
            Tenant(name='Sarah Wanjiku', phone='+254723456789', id_number='12345678', email='sarah@Yahoo.com'),
            Tenant(name='James Mwangi', phone='+254734567891', id_number='23456789', email='james@Outlook.com'),
            Tenant(name='Grace Njeri', phone='+254745678902', id_number='34567890', email='grace@Gmail.com'),
            Tenant(name='David Kipchoge', phone='+254756789013', id_number='45678901', email='david@Gmail.com'),
            Tenant(name='Lucy Wambui', phone='+254767890124', id_number='56789012', email='lucy@Gmail.com'),
        ]
        db.session.add_all(tenants)
        db.session.commit()

        sarah = Tenant.query.filter_by(name='Sarah Wanjiku').first()
        james = Tenant.query.filter_by(name='James Mwangi').first()
        grace = Tenant.query.filter_by(name='Grace Njeri').first()

        # Units
        units = [
            Unit(unit_number='A101', rent_amount=45000, status='occupied',
                 property_id=skyline.id, tenant_id='tnt_001', move_in_date=date(2024, 2, 1)),
            Unit(unit_number='A102', rent_amount=42000, status='occupied',
                 property_id=skyline.id, tenant_id='tnt_002', move_in_date=date(2024, 2, 1)),
            Unit(unit_number='A103', rent_amount=40000, status='vacant',
                 property_id=skyline.id),
        ]
        db.session.add_all(units)
        db.session.commit()

        # Payments 
        
        payments = [
            Payment(
                tenant_id=sarah.id,
                amount=45000,
                mpesa_code='JHFYRGA001',
                paid_date=datetime(2024, 2, 1, 10, 30),
                status='completed'
            ),
            Payment(
                tenant_id=sarah.id,
                amount=45000,
                mpesa_code='YTRFGV002',
                paid_date=datetime(2024, 3, 1, 9, 15),
                status='completed'
            ),
            Payment(
                tenant_id=james.id,
                amount=42000,
                mpesa_code='SDVXA003',
                paid_date=datetime(2024, 2, 1, 11, 0),
                status='completed'
            ),
            Payment(
                tenant_id=grace.id,
                amount=48000,
                mpesa_code='UAVSA004',
                paid_date=datetime(2024, 2, 5, 14, 20),
                status='completed'
            ),
        ]
        db.session.add_all(payments)
        db.session.commit()

        print("Database seeded successfully!")
        print("Landlords, Properties, Tenants, Units, and Payments added")
        print(f"Landlords: {len(landlords)} (IDs: {john.id}, {mary.id}, {peter.id})")
        print(f"Properties: {len(properties)}")
        print(f"Tenants: {len(tenants)}")
        print(f"Units: {len(units)}")
        print(f"Payments: {len(payments)}")

if __name__ == '__main__':
    clear_data()
    seed_data()
