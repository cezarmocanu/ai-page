from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from .TemplateForm import TemplateForm
from .Page import Page
from .Topic import Topic
from .Option import Option
from .TemplateImage import TemplateImage