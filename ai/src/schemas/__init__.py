
from flask_marshmallow import Marshmallow
ma = Marshmallow()


from .TemplateImage import TemplateImageSchema
from .Option import OptionSchema
from .Page import PageSchema
from .TemplateForm import TemplateFormSchema
from .Topic import TopicSchema
SCHEMAS={
    'TemplateImage': {
        'single': TemplateImageSchema(),
        'many': TemplateImageSchema(many=True)
    },

    'Option': {
        'single': OptionSchema(),
        'many': OptionSchema(many=True)
    },

    'Page': {
        'single': PageSchema(),
        'many': PageSchema(many=True)
    },

    'TemplateForm': {
        'single': TemplateFormSchema(),
        'many': TemplateFormSchema(many=True)
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
