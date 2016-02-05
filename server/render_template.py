from jinja2 import Environment, FileSystemLoader

templateLoader = FileSystemLoader(searchpath = "templates")
templateEnv = Environment(loader=templateLoader)

def render(tName,tDict={}):
	template = templateEnv.get_template("%s.html"%(tName))
	return template.render(**tDict)