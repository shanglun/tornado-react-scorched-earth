import tornado.web
import tornado.websocket
from render_template import render


class MainHandler(tornado.web.RequestHandler):
	def get(self):
		self.write(render('main'))

class SocketHandler(tornado.websocket.WebSocketHandler):
	def open(self):
		print("socket opened")
		pass
	def on_message(self,message):
		print("got message from client: %s" %(message))
		self.write_message("got it!")
		pass
	def on_close(self):
		print("socket closed")
		pass
			
urlmap = [
		(r"/", MainHandler),
		(r"/socket",SocketHandler),
		(r"/static/(.*)", tornado.web.StaticFileHandler, {'path':'/static'}),
		(r"/(output.js)", tornado.web.StaticFileHandler, {'path':'../client/output'})
	]