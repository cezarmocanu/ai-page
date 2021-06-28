from . import db
from models import db, TemplateForm, TemplateImage, Page

class BirdeyeImage(db.Model):
    __tablename__ = 'collected_image'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'), nullable=False)