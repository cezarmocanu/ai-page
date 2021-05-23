
from flask_marshmallow import Marshmallow
ma = Marshmallow()


from .Option import OptionSchema
from .Page import PageSchema
from .OCRAnalysis import OCRAnalysisSchema
from .Form import FormSchema
from .Topic import TopicSchema
SCHEMAS={
    'Option': {
        'single': OptionSchema(),
        'many': OptionSchema(many=True)
    },

    'Page': {
        'single': PageSchema(),
        'many': PageSchema(many=True)
    },

    'OCRAnalysis': {
        'single': OCRAnalysisSchema(),
        'many': OCRAnalysisSchema(many=True)
    },

    'Form': {
        'single': FormSchema(),
        'many': FormSchema(many=True)
    },

    'Topic': {
        'single': TopicSchema(),
        'many': TopicSchema(many=True)
    },
}

def dump(object):
    if(type(object).__name__ == 'InstrumentedList'):
        t = type(object[0]).__name__
        return SCHEMAS[t]['many'].dump(object)
    t = type(object).__name__
    return SCHEMAS[t]['single'].dump(object)
