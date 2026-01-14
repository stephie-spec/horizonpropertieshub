from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

db = SQLAlchemy()


class Landlord(db.Model, SerializerMixin):
    __tablename__ = 'landlords'

    serialize_rules = ('-properties.landlord',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    properties = relationship('Property', back_populates='landlord')


class Property(db.Model, SerializerMixin):
    __tablename__ = 'properties'

    serialize_rules = (
        '-landlord.properties',
        '-units.property'
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    description = db.Column(db.Text)
    landlord_id = db.Column(db.Integer, ForeignKey('landlords.id'), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    landlord = relationship('Landlord', back_populates='properties')
    units = relationship('Unit', back_populates='property')


class Tenant(db.Model, SerializerMixin):
    __tablename__ = 'tenants'

    serialize_rules = (
        '-units.tenant',
        '-payments.tenant'
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, unique=True)
    id_number = db.Column(db.String, unique=True)
    email = db.Column(db.String)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    units = relationship('Unit', back_populates='tenant')
    payments = relationship('Payment', back_populates='tenant')


class Unit(db.Model, SerializerMixin):
    __tablename__ = 'units'

    serialize_rules = (
        '-property.units',
        '-tenant.units'
    )

    id = db.Column(db.Integer, primary_key=True)
    unit_number = db.Column(db.String)
    rent_amount = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String, default='vacant')
    property_id = db.Column(db.Integer, ForeignKey('properties.id'), nullable=False)
    tenant_id = db.Column(db.Integer, ForeignKey('tenants.id'))
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    move_in_date = db.Column(db.Date)
    move_out_date = db.Column(db.Date)

    property = relationship('Property', back_populates='units')
    tenant = relationship('Tenant', back_populates='units')

    __table_args__ = (
        db.UniqueConstraint('property_id', 'unit_number'),
    )


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    serialize_rules = ('-tenant.payments',)

    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, ForeignKey('tenants.id'))
    amount = db.Column(db.Numeric(10, 2))
    mpesa_code = db.Column(db.String, unique=True)
    paid_date = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    status = db.Column(db.String, default='pending')

    tenant = relationship('Tenant', back_populates='payments')

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "amount": float(self.amount),
            "mpesa_code": self.mpesa_code,
            "status": self.status,
            "paid_date": self.paid_date.isoformat() if self.paid_date else None
        }
