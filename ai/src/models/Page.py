from . import db

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)
    topics = db.relationship('Topic',backref='page',lazy=True)
    template_image_id = db.Column(db.Integer, db.ForeignKey('template_image.id'))