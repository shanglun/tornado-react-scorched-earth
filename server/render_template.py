'''Uses jinja2 to render template pages in the tempalte directory'''
from jinja2 import Environment, FileSystemLoader

TEMPLATE_LOADER = FileSystemLoader(searchpath="templates")
TEMPLATE_ENV = Environment(loader=TEMPLATE_LOADER)

def render(temp_name, temp_dict):
    '''Render using jinja, passing in environment variables'''
    template = TEMPLATE_ENV.get_template("%s.html"%(temp_name))
    return template.render(**temp_dict)
