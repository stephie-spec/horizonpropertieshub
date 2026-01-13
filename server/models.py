from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

db = SQLAlchemy()

#Models
class Landlord(db.Model):
    __tablename__ = 'landlords'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)

    properties = relationship(
        'Property',
        back_populates='landlord',
        cascade='all, delete-orphan'
    )


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    units_count = db.Column(db.Integer, nullable=False)

    landlord_id = db.Column(
        db.String,
        ForeignKey('landlords.id'),
        nullable=False
    )

    landlord = relationship('Landlord', back_populates='properties')
    units = relationship(
        'Unit',
        back_populates='property',
        cascade='all, delete-orphan'
    )


class Unit(db.Model):
    __tablename__ = 'units'

    id = db.Column(db.String, primary_key=True)
    unit_number = db.Column(db.String, nullable=False)
    rent_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String, nullable=False)

    property_id = db.Column(
        db.String,
        ForeignKey('properties.id'),
        nullable=False
    )

    property = relationship('Property', back_populates='units')
    tenants = relationship(
        'Tenant',
        back_populates='unit',
        cascade='all, delete-orphan'
    )


class Tenant(db.Model):
    __tablename__ = 'tenants'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    id_number = db.Column(db.String, nullable=False)

    unit_id = db.Column(
        db.String,
        ForeignKey('units.id'),
        nullable=False
    )

    move_in_date = db.Column(db.DateTime, default=datetime.utcnow)

    unit = relationship('Unit', back_populates='tenants')


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String, primary_key=True)
    tenant_id = db.Column(db.String, db.ForeignKey('tenants.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    mpesa_code = db.Column(db.String, unique=True, nullable=False)
    paid_date = db.Column(db.DateTime, default=datetime.utcnow)



