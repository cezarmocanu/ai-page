from . import db

class Topic(db.Model):
    id=db.Column(db.Integer,primary_key=True )
    title=db.Column(db.String(128), nullable=False)
    page_id=db.Column(db.Integer,db.ForeignKey('page.id'),nullable=False)
    options = db.relationship('Option', backref='topic', lazy=True)
    verified = db.Column(db.Boolean, default = False, nullable=False)