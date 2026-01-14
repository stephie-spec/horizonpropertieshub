# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import ForeignKey
# from sqlalchemy.orm import relationship
# from datetime import datetime

# db = SQLAlchemy()


# class Landlord(db.Model):
#     __tablename__ = 'landlords'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, nullable=False)
#     phone = db.Column(db.String, unique=True)
#     email = db.Column(db.String, unique=True, nullable=False)
#     password_hash = db.Column(db.String)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     properties = relationship('Property', back_populates='landlord')


# class Property(db.Model):
#     __tablename__ = 'properties'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String)
#     location = db.Column(db.String)
#     description = db.Column(db.Text)
#     landlord_id = db.Column(db.Integer, ForeignKey('landlords.id'), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     landlord = relationship('Landlord', back_populates='properties')
#     units = relationship('Unit', back_populates='property')


# class Tenant(db.Model):
#     __tablename__ = 'tenants'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, nullable=False)
#     phone = db.Column(db.String, unique=True)
#     id_number = db.Column(db.String, unique=True)
#     email = db.Column(db.String)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     units = relationship('Unit', back_populates='tenant')
#     payments = relationship('Payment', back_populates='tenant')


# class Unit(db.Model):
#     __tablename__ = 'units'

#     id = db.Column(db.Integer, primary_key=True)
#     unit_number = db.Column(db.String)
#     rent_amount = db.Column(db.Numeric(10, 2))
#     status = db.Column(db.String, default='vacant')
#     property_id = db.Column(db.Integer, ForeignKey('properties.id'), nullable=False)
#     tenant_id = db.Column(db.Integer, ForeignKey('tenants.id'))
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     move_in_date = db.Column(db.Date)
#     move_out_date = db.Column(db.Date)

#     property = relationship('Property', back_populates='units')
#     tenant = relationship('Tenant', back_populates='units')

#     __table_args__ = (
#         db.UniqueConstraint('property_id', 'unit_number'),
#     )


# class Payment(db.Model):
#     __tablename__ = 'payments'

#     id = db.Column(db.Integer, primary_key=True)
#     tenant_id = db.Column(db.Integer, ForeignKey('tenants.id'))
#     amount = db.Column(db.Numeric(10, 2))
#     mpesa_code = db.Column(db.String, unique=True)
#     paid_date = db.Column(db.DateTime, default=datetime.utcnow)
#     status = db.Column(db.String, default='pending')
#     tenant = relationship('Tenant', back_populates='payments')


from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

db = SQLAlchemy()


class Landlord(db.Model):
    __tablename__ = 'landlords'

    id = db.Column(db.String, primary_key=True) 
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    properties = relationship('Property', back_populates='landlord')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    description = db.Column(db.Text)
    landlord_id = db.Column(db.String, ForeignKey('landlords.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    landlord = relationship('Landlord', back_populates='properties')
    units = relationship('Unit', back_populates='property')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "description": self.description,
            "landlord_id": self.landlord_id,
            "created_at": self.created_at.isoformat()
        }


class Tenant(db.Model):
    __tablename__ = 'tenants'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, unique=True)
    id_number = db.Column(db.String, unique=True)
    email = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    units = relationship('Unit', back_populates='tenant')
    payments = relationship('Payment', back_populates='tenant')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "id_number": self.id_number,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }


class Unit(db.Model):
    __tablename__ = 'units'

    id = db.Column(db.String, primary_key=True)
    unit_number = db.Column(db.String)
    rent_amount = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String, default='vacant')
    property_id = db.Column(db.String, ForeignKey('properties.id'), nullable=False)
    tenant_id = db.Column(db.String, ForeignKey('tenants.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    move_in_date = db.Column(db.Date)
    move_out_date = db.Column(db.Date)

    property = relationship('Property', back_populates='units')
    tenant = relationship('Tenant', back_populates='units')

    __table_args__ = (
        db.UniqueConstraint('property_id', 'unit_number', name='uq_property_unit'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "unit_number": self.unit_number,
            "rent_amount": str(self.rent_amount),
            "status": self.status,
            "property_id": self.property_id,
            "tenant_id": self.tenant_id,
            "created_at": self.created_at.isoformat(),
            "move_in_date": self.move_in_date.isoformat() if self.move_in_date else None,
            "move_out_date": self.move_out_date.isoformat() if self.move_out_date else None
        }


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String, primary_key=True)
    tenant_id = db.Column(db.String, ForeignKey('tenants.id'))
    amount = db.Column(db.Numeric(10, 2))
    mpesa_code = db.Column(db.String, unique=True)
    paid_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String, default='pending')
    tenant = relationship('Tenant', back_populates='payments')

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "amount": str(self.amount),
            "mpesa_code": self.mpesa_code,
            "paid_date": self.paid_date.isoformat(),
            "status": self.status
        }



