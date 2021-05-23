from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from .Form import Form
from .Page import Page
from .Topic import Topic
from .Option import Option
from .OCRAnalysis import OCRAnalysis