import tornado.web
import tornado.websocket
from render_template import render

import comm

class MainHandler(tornado.web.RequestHandler):
	def get(self):
		self.write(render('main'))

class SocketHandler(tornado.websocket.WebSocketHandler):
	def open(self):
		comm.register_socket(self)
		pass
	def on_message(self,message):
		comm.handle_server_message(self,message)
		pass
	def on_close(self):
		comm.deregister_socket(self)
		pass

urlmap = [
		(r"/", MainHandler),
		(r"/socket",SocketHandler),
		(r"/static/(.*)", tornado.web.StaticFileHandler, {'path':'/static'}),
		(r"/(output.js)", tornado.web.StaticFileHandler, {'path':'../client/output'})
	]
