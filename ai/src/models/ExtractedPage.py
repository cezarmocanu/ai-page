from . import db

class ExtractedPage(db.Model):
    __tablename__ = 'extracted_page'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    extractions = db.relationship('Extraction', backref='extracted_page', cascade="all,delete", lazy=True)
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'), nullable=False)
    verified = db.Column(db.Boolean, default = False, nullable=False)