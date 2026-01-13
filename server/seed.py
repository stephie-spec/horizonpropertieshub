from app import app
from models import db, Landlord, Property, Unit, Tenant, Payment, TenantPayment
from datetime import datetime, timedelta, UTC
import random

def clear_data():
    """Clear all existing data from the database"""
    print("Clearing existing data...")
    with app.app_context():
        db.drop_all()
        db.create_all()
    print("Database cleared and tables recreated.")

def seed_data():
    """Seed the database with sample data"""
    print("Starting to seed data...")
    
    with app.app_context():
        # Create Landlords
        landlords = [
            Landlord(
                id='LL001',
                name='John Kamau',
                phone='+254712345678',
                email='john.kamau@email.com'
            ),
            Landlord(
                id='LL002',
                name='Mary Wanjiru',
                phone='+254723456789',
                email='mary.wanjiru@email.com'
            ),
            Landlord(
                id='LL003',
                name='Peter Ochieng',
                phone='+254734567890',
                email='peter.ochieng@email.com'
            )
        ]
        db.session.add_all(landlords)
        db.session.commit()
        print(f"Created {len(landlords)} landlords")

        # Create Properties
        properties = [
            Property(
                id='PROP001',
                name='Sunrise Apartments',
                location='Westlands, Nairobi',
                units_count=10,
                landlord_id='LL001'
            ),
            Property(
                id='PROP002',
                name='Green Valley Estate',
                location='Kilimani, Nairobi',
                units_count=15,
                landlord_id='LL001'
            ),
            Property(
                id='PROP003',
                name='Ocean View Residences',
                location='Nyali, Mombasa',
                units_count=8,
                landlord_id='LL002'
            ),
            Property(
                id='PROP004',
                name='Highland Towers',
                location='Karen, Nairobi',
                units_count=12,
                landlord_id='LL003'
            )
        ]
        db.session.add_all(properties)
        db.session.commit()
        print(f"Created {len(properties)} properties")

        # Create Units
        units = []
        statuses = ['occupied', 'vacant', 'occupied', 'occupied']
        
        # Units for Sunrise Apartments
        for i in range(1, 11):
            units.append(Unit(
                id=f'UNIT{i:03d}',
                unit_number=f'A{i}',
                rent_amount=25000 + (i * 1000),
                status=statuses[i % len(statuses)],
                property_id='PROP001'
            ))
        
        # Units for Green Valley Estate
        for i in range(11, 26):
            units.append(Unit(
                id=f'UNIT{i:03d}',
                unit_number=f'B{i-10}',
                rent_amount=30000 + ((i-10) * 1500),
                status=statuses[i % len(statuses)],
                property_id='PROP002'
            ))
        
        # Units for Ocean View Residences
        for i in range(26, 34):
            units.append(Unit(
                id=f'UNIT{i:03d}',
                unit_number=f'C{i-25}',
                rent_amount=40000 + ((i-25) * 2000),
                status=statuses[i % len(statuses)],
                property_id='PROP003'
            ))
        
        # Units for Highland Towers
        for i in range(34, 46):
            units.append(Unit(
                id=f'UNIT{i:03d}',
                unit_number=f'D{i-33}',
                rent_amount=35000 + ((i-33) * 1800),
                status=statuses[i % len(statuses)],
                property_id='PROP004'
            ))
        
        db.session.add_all(units)
        db.session.commit()
        print(f"Created {len(units)} units")

        # Create Tenants (only for occupied units)
        tenants = []
        tenant_names = [
            'James Mwangi', 'Sarah Akinyi', 'David Kipchoge', 'Grace Njeri',
            'Michael Otieno', 'Lucy Wambui', 'Daniel Kariuki', 'Ruth Muthoni',
            'Joseph Barasa', 'Faith Chebet', 'Samuel Omondi', 'Jane Nyambura',
            'Brian Kimani', 'Ann Wairimu', 'Kevin Mutua', 'Diana Awuor',
            'Mark Njuguna', 'Emily Jepkoech', 'Paul Wekesa', 'Carol Wangari',
            'Steven Korir', 'Rebecca Achieng', 'Patrick Maina', 'Susan Moraa',
            'Anthony Kibet', 'Helen Wanjiku', 'Francis Okoth', 'Catherine Nyokabi'
        ]
        
        tenant_counter = 1
        for unit in units:
            if unit.status == 'occupied':
                move_in_date = datetime.now(UTC) - timedelta(days=random.randint(30, 730))
                tenant = Tenant(
                    id=f'TEN{tenant_counter:03d}',
                    name=tenant_names[tenant_counter-1] if tenant_counter <= len(tenant_names) else f'Tenant {tenant_counter}',
                    phone=f'+25471{random.randint(1000000, 9999999)}',
                    id_number=f'{random.randint(10000000, 99999999)}',
                    unit_id=unit.id,
                    move_in_date=move_in_date
                )
                tenants.append(tenant)
                tenant_counter += 1
        
        db.session.add_all(tenants)
        db.session.commit()
        print(f"Created {len(tenants)} tenants")

        # Create Payments
        payments = []
        months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
        years = [2024, 2025]
        
        payment_counter = 1
        for tenant in tenants[:20]:  # Create payments for first 20 tenants
            # Create 2-4 payments per tenant
            num_payments = random.randint(2, 4)
            for _ in range(num_payments):
                payment_date = datetime.now(UTC) - timedelta(days=random.randint(1, 180))
                payment = Payment(
                    id=f'PAY{payment_counter:04d}',
                    month=months[payment_date.month - 1],
                    year=payment_date.year,
                    amount=tenant.unit.rent_amount,
                    mpesa_code=f'QR{random.randint(100000000, 999999999)}',
                    paid_date=payment_date
                )
                payments.append(payment)
                payment_counter += 1
        
        db.session.add_all(payments)
        db.session.commit()
        print(f" Created {len(payments)} payments")

        # Create TenantPayments (linking tenants to their payments)
        tenant_payments = []
        payment_index = 0
        for tenant in tenants[:20]:
            num_payments = random.randint(2, 4)
            for _ in range(num_payments):
                if payment_index < len(payments):
                    remarks_options = [
                        'Full payment received',
                        'Partial payment - balance pending',
                        'Payment received on time',
                        'Late payment with penalty',
                        None
                    ]
                    tenant_payment = TenantPayment(
                        tenant_id=tenant.id,
                        payment_id=payments[payment_index].id,
                        remarks=random.choice(remarks_options)
                    )
                    tenant_payments.append(tenant_payment)
                    payment_index += 1
        
        db.session.add_all(tenant_payments)
        db.session.commit()
        print(f"Created {len(tenant_payments)} tenant-payment associations")

        print("\n Database seeding completed successfully!")
        print(f"\n Summary:")
        print(f"  - {len(landlords)} Landlords")
        print(f"  - {len(properties)} Properties")
        print(f"  - {len(units)} Units")
        print(f"  - {len(tenants)} Tenants")
        print(f"  - {len(payments)} Payments")
        print(f"  - {len(tenant_payments)} Tenant-Payment Links")

if __name__ == '__main__':
    clear_data()
    seed_data()