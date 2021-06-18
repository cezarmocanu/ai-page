from . import db

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    topics = db.relationship('Topic', backref='page', lazy=True)
    form_id = db.Column(db.Integer, db.ForeignKey('template_form.id'), nullable=False)
    verified = db.Column(db.Boolean, default = False, nullable=False)