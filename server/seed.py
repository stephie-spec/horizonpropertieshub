# from app import app
# from models import db, Landlord, Property, Unit, Tenant, Payment
# from datetime import datetime, date
# from werkzeug.security import generate_password_hash

# def clear_data():
#     """Clear all existing data from the database"""
#     print("Clearing existing data...")
#     with app.app_context():
#         db.drop_all()
#         db.create_all()
#     print("Database cleared and tables recreated.\n")

# def seed_data():
#     """Seed the database with sample data"""
#     print("Starting to seed data...")
    
#     with app.app_context():
#         # Create Landlords
#         landlord_data = [
#             ('lnd_001', 'John Kamau', '+254712345678', 'john@example.com'),
#             ('lnd_002', 'Mary Wanjiru', '+254723456789', 'mary@example.com'),
#             ('lnd_003', 'Peter Ochieng', '+254734567890', 'peter@example.com')
#         ]
        
#         landlords = [
#             Landlord(
#                 id=id, name=name, phone=phone, email=email,
#                 password_hash=generate_password_hash('password123'),
#                 created_at=datetime(2024, 1, 15 + i, 10, 30, 0)
#             )
#             for i, (id, name, phone, email) in enumerate(landlord_data)
#         ]
#         db.session.add_all(landlords)
#         db.session.commit()
#         print(f" Created {len(landlords)} landlords")

#         # Create Properties
#         property_data = [
#             ('prop_001', 'Skyline Apartments', 'Westlands, Nairobi', 'Luxury apartments with city view', 'lnd_001'),
#             ('prop_002', 'Green Valley Estate', 'Kilimani, Nairobi', 'Family-friendly estate with parking', 'lnd_001'),
#             ('prop_003', 'Ocean View Residences', 'Nyali, Mombasa', 'Beachfront property with ocean views', 'lnd_002'),
#             ('prop_004', 'Highland Towers', 'Karen, Nairobi', 'Premium high-rise apartments', 'lnd_003')
#         ]
        
#         properties = [
#             Property(
#                 id=id, name=name, location=loc, description=desc, landlord_id=l_id,
#                 created_at=datetime(2024, 1, 20 + i, 9, 15, 0)
#             )
#             for i, (id, name, loc, desc, l_id) in enumerate(property_data)
#         ]
#         db.session.add_all(properties)
#         db.session.commit()
#         print(f" Created {len(properties)} properties")

#         # Create Tenants
#         tenant_data = [
#             ('tnt_001', 'Sarah Wanjiku', '+254723456789', '12345678', 'sarah@example.com'),
#             ('tnt_002', 'James Mwangi', '+254734567891', '23456789', 'james@example.com'),
#             ('tnt_003', 'Grace Njeri', '+254745678902', '34567890', 'grace@example.com'),
#             ('tnt_004', 'David Kipchoge', '+254756789013', '45678901', 'david@example.com'),
#             ('tnt_005', 'Lucy Wambui', '+254767890124', '56789012', 'lucy@example.com'),
#             ('tnt_006', 'Michael Otieno', '+254778901235', '67890123', 'michael@example.com'),
#             ('tnt_007', 'Ruth Muthoni', '+254789012346', '78901234', 'ruth@example.com'),
#             ('tnt_008', 'Daniel Kariuki', '+254790123457', '89012345', 'daniel@example.com'),
#             ('tnt_009', 'Faith Chebet', '+254701234568', '90123456', 'faith@example.com'),
#             ('tnt_010', 'Joseph Barasa', '+254712345679', '01234567', 'joseph@example.com')
#         ]
        
#         tenants = [
#             Tenant(
#                 id=id, name=name, phone=phone, id_number=id_num, email=email,
#                 created_at=datetime(2024, 1, 28 + i, 11, 45, 0)
#             )
#             for i, (id, name, phone, id_num, email) in enumerate(tenant_data)
#         ]
#         db.session.add_all(tenants)
#         db.session.commit()
#         print(f"Created {len(tenants)} tenants")

#         # Create Units 
#         unit_data = [
#             # Skyline Apartments (prop_001)
#             ('unit_001', 'A101', 45000.00, 'occupied', 'prop_001', 'tnt_001', date(2024, 2, 1)),
#             ('unit_002', 'A102', 42000.00, 'occupied', 'prop_001', 'tnt_002', date(2024, 2, 1)),
#             ('unit_003', 'A103', 40000.00, 'vacant', 'prop_001', None, None),
#             ('unit_004', 'A201', 48000.00, 'occupied', 'prop_001', 'tnt_003', date(2024, 2, 5)),
#             ('unit_005', 'A202', 46000.00, 'vacant', 'prop_001', None, None),
#             ('unit_006', 'A203', 44000.00, 'occupied', 'prop_001', 'tnt_004', date(2024, 2, 10)),
#             ('unit_007', 'A301', 50000.00, 'occupied', 'prop_001', 'tnt_005', date(2024, 2, 1)),
#             ('unit_008', 'A302', 49000.00, 'vacant', 'prop_001', None, None),
            
#             # Green Valley Estate (prop_002)
#             ('unit_009', 'B101', 35000.00, 'occupied', 'prop_002', 'tnt_006', date(2024, 2, 1)),
#             ('unit_010', 'B102', 35000.00, 'occupied', 'prop_002', 'tnt_007', date(2024, 2, 3)),
#             ('unit_011', 'B103', 33000.00, 'vacant', 'prop_002', None, None),
#             ('unit_012', 'B201', 38000.00, 'occupied', 'prop_002', 'tnt_008', date(2024, 2, 5)),
#             ('unit_013', 'B202', 38000.00, 'vacant', 'prop_002', None, None),
#             ('unit_014', 'B203', 36000.00, 'occupied', 'prop_002', 'tnt_009', date(2024, 2, 8)),
            
#             # Ocean View Residences (prop_003)
#             ('unit_015', 'C101', 55000.00, 'occupied', 'prop_003', 'tnt_010', date(2024, 2, 1)),
#             ('unit_016', 'C102', 52000.00, 'vacant', 'prop_003', None, None),
#             ('unit_017', 'C201', 60000.00, 'vacant', 'prop_003', None, None),
#             ('unit_018', 'C202', 58000.00, 'vacant', 'prop_003', None, None),
#             ('unit_019', 'C301', 65000.00, 'vacant', 'prop_003', None, None),
            
#             # Highland Towers (prop_004)
#             ('unit_020', 'D101', 40000.00, 'vacant', 'prop_004', None, None),
#             ('unit_021', 'D102', 42000.00, 'vacant', 'prop_004', None, None),
#             ('unit_022', 'D201', 45000.00, 'vacant', 'prop_004', None, None),
#             ('unit_023', 'D202', 47000.00, 'vacant', 'prop_004', None, None),
#             ('unit_024', 'D301', 50000.00, 'vacant', 'prop_004', None, None),
#         ]
        
#         units = [
#             Unit(
#                 id=id, unit_number=num, rent_amount=rent, status=status,
#                 property_id=prop_id, tenant_id=tenant_id,
#                 created_at=datetime(2024, 1, 25, 14, 20 + i * 5, 0),
#                 move_in_date=move_in, move_out_date=None
#             )
#             for i, (id, num, rent, status, prop_id, tenant_id, move_in) in enumerate(unit_data)
#         ]
#         db.session.add_all(units)
#         db.session.commit()
#         print(f"✓ Created {len(units)} units")

#         # Create Payments 
#         payment_data = [
#             ('pay_001', 'tnt_001', 45000.00, 'ABC123XYZ', datetime(2024, 2, 1, 8, 30, 0), 'completed'),
#             ('pay_002', 'tnt_001', 45000.00, 'DEF456UVW', datetime(2024, 3, 1, 9, 15, 0), 'completed'),
#             ('pay_003', 'tnt_002', 42000.00, 'GHI789RST', datetime(2024, 2, 1, 10, 0, 0), 'completed'),
#             ('pay_004', 'tnt_002', 42000.00, 'JKL012OPQ', datetime(2024, 3, 3, 14, 20, 0), 'completed'),
#             ('pay_005', 'tnt_003', 48000.00, 'MNO345LMN', datetime(2024, 2, 5, 11, 30, 0), 'completed'),
#             ('pay_006', 'tnt_004', 44000.00, 'PQR678IJK', datetime(2024, 2, 10, 8, 45, 0), 'completed'),
#             ('pay_007', 'tnt_004', 44000.00, 'STU901GHI', datetime(2024, 3, 10, 9, 0, 0), 'completed'),
#             ('pay_008', 'tnt_005', 50000.00, 'VWX234DEF', datetime(2024, 2, 1, 12, 15, 0), 'completed'),
#             ('pay_009', 'tnt_005', 50000.00, 'YZA567ABC', datetime(2024, 3, 1, 10, 30, 0), 'completed'),
#             ('pay_010', 'tnt_006', 35000.00, 'BCD890ZYX', datetime(2024, 2, 1, 13, 0, 0), 'completed'),
#             ('pay_011', 'tnt_007', 35000.00, 'EFG123WVU', datetime(2024, 2, 3, 15, 45, 0), 'completed'),
#             ('pay_012', 'tnt_007', 35000.00, 'HIJ456TSR', datetime(2024, 3, 5, 11, 20, 0), 'pending'),
#             ('pay_013', 'tnt_008', 38000.00, 'KLM789QPO', datetime(2024, 2, 5, 9, 30, 0), 'completed'),
#             ('pay_014', 'tnt_009', 36000.00, 'NOP012NML', datetime(2024, 2, 8, 14, 0, 0), 'completed'),
#             ('pay_015', 'tnt_009', 36000.00, 'QRS345KJI', datetime(2024, 3, 8, 10, 15, 0), 'completed'),
#             ('pay_016', 'tnt_010', 55000.00, 'TUV678HGF', datetime(2024, 2, 1, 16, 30, 0), 'completed'),
#             ('pay_017', 'tnt_010', 55000.00, 'WXY901EDC', datetime(2024, 3, 1, 12, 45, 0), 'completed'),
#         ]
        
#         payments = [
#             Payment(
#                 id=id, tenant_id=tenant_id, amount=amount,
#                 mpesa_code=code, paid_date=paid, status=status
#             )
#             for id, tenant_id, amount, code, paid, status in payment_data
#         ]
#         db.session.add_all(payments)
#         db.session.commit()
#         print(f" Created {len(payments)} payments")

#         print("\n Database seeding completed successfully!")
#         print(f"\nSummary:")
#         print(f"  - {len(landlords)} Landlords")
#         print(f"  - {len(properties)} Properties")
#         print(f"  - {len(units)} Units (10 occupied, 14 vacant)")
#         print(f"  - {len(tenants)} Tenants")
#         print(f"  - {len(payments)} Payments")

# if __name__ == '__main__':
#     clear_data()
#     seed_data()

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
            Landlord(id='lnd_001', name='John Kamau', phone='+254712345678', email='johnKamau@Yahoo.com',
                     password_hash=generate_password_hash('password123')),
            Landlord(id='lnd_002', name='Mary Wanjiru', phone='+254723456789', email='mary@gmail.com',
                     password_hash=generate_password_hash('password123')),
            Landlord(id='lnd_003', name='Peter Ochieng', phone='+254734567890', email='peter@gmail.com',
                     password_hash=generate_password_hash('password123')),
        ]
        db.session.add_all(landlords)
        db.session.commit()

        # Properties
        properties = [
            Property(id='prop_001', name='Skyline Apartments', location='Westlands, Nairobi',
                     description='Luxury apartments', landlord_id='lnd_001'),
            Property(id='prop_002', name='Green Valley Estate', location='Kilimani, Nairobi',
                     description='Family-friendly estate', landlord_id='lnd_001'),
            Property(id='prop_003', name='Ocean View Residences', location='Nyali, Mombasa',
                     description='Beachfront property', landlord_id='lnd_002'),
            Property(id='prop_004', name='Highland Towers', location='Karen, Nairobi',
                     description='Premium high-rise', landlord_id='lnd_003'),
        ]
        db.session.add_all(properties)
        db.session.commit()

        # Tenants
        tenants = [
            Tenant(id='tnt_001', name='Sarah Wanjiku', phone='+254723456789', id_number='12345678', email='sarah@Yahoo.com'),
            Tenant(id='tnt_002', name='James Mwangi', phone='+254734567891', id_number='23456789', email='james@Outlook.com'),
            Tenant(id='tnt_003', name='Grace Njeri', phone='+254745678902', id_number='34567890', email='grace@Gmail.com'),
            Tenant(id='tnt_004', name='David Kipchoge', phone='+254756789013', id_number='45678901', email='david@Gmail.com'),
            Tenant(id='tnt_005', name='Lucy Wambui', phone='+254767890124', id_number='56789012', email='lucy@Gmail.com'),
        ]
        db.session.add_all(tenants)
        db.session.commit()

        # Units
        units = [
            Unit(id='unit_001', unit_number='A101', rent_amount=45000, status='occupied',
                 property_id='prop_001', tenant_id='tnt_001', move_in_date=date(2024, 2, 1)),
            Unit(id='unit_002', unit_number='A102', rent_amount=42000, status='occupied',
                 property_id='prop_001', tenant_id='tnt_002', move_in_date=date(2024, 2, 1)),
            Unit(id='unit_003', unit_number='A103', rent_amount=40000, status='vacant',
                 property_id='prop_001'),
        ]
        db.session.add_all(units)
        db.session.commit()

        # Payments 
        
        payments = [
            Payment(
                id='pay_001',
                tenant_id='tnt_001',
                amount=45000,
                mpesa_code='JHFYRGA001',
                paid_date=datetime(2024, 2, 1, 10, 30),
                status='completed'
            ),
            Payment(
                id='pay_002',
                tenant_id='tnt_001',
                amount=45000,
                mpesa_code='YTRFGV002',
                paid_date=datetime(2024, 3, 1, 9, 15),
                status='completed'
            ),
            Payment(
                id='pay_003',
                tenant_id='tnt_002',
                amount=42000,
                mpesa_code='SDVXA003',
                paid_date=datetime(2024, 2, 1, 11, 0),
                status='completed'
            ),
            Payment(
                id='pay_004',
                tenant_id='tnt_003',
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

if __name__ == '__main__':
    clear_data()
    seed_data()
