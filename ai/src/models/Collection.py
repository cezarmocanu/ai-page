from . import db

class Collection(db.Model):
    __tablename__ = 'collection'
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('template_form.id'), nullable=False)
    images = db.relationship('CollectedImage', backref='collection', cascade="all,delete",lazy=True)
    birdeyes = db.relationship('BirdeyeImage', backref='collection', cascade="all,delete",lazy=True)
    extracted = db.relationship('ExtractedPage', backref='collection', cascade="all,delete",lazy=True)