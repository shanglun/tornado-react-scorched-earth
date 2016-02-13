import tornado.web
import tornado.websocket
from render_template import render

import comm
import commtank

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

class TankSocketHandler(tornado.websocket.WebSocketHandler):
	def open(self):
		commtank.register_socket(self)
		pass
	def on_message(self,message):
		commtank.handle_server_message(self,message)
		pass
	def on_close(self):
		commtank.deregister_socket(self)
		pass

urlmap = [
		(r"/", MainHandler),
		(r"/socket",SocketHandler),
		(r"/socket/tank", TankSocketHandler),
		(r"/static/(.*)", tornado.web.StaticFileHandler, {'path':'./static'}),
		(r"/static/rcs/(.*)", tornado.web.StaticFileHandler, {'path':'./static/rcs'}),
		(r"/(output.js)", tornado.web.StaticFileHandler, {'path':'../client/output'})
	]
