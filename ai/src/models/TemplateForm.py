from . import db

class TemplateForm(db.Model):
    __tablename__ = 'template_form'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(32), nullable=False)
    pages = db.relationship('Page', backref='template_form', cascade="all,delete", lazy=True)
    images = db.relationship('TemplateImage', backref='template_form', cascade="all,delete",lazy=True)
    collections = db.relationship('Collection', backref='template_form', cascade="all,delete",lazy=True)
    # collected_images = db.relationship('CollectedImage', backref='template_form', cascade="all,delete",lazy=True)