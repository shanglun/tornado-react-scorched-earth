import tornado.web
import tornado.websocket
from render_template import render
import json

ALL_CONN = []

def handle_server_message(message):
	global ALL_CONN
	json_string = {'nextWord': message['nextWord']}
	for conn in ALL_CONN:
		conn.write_message(json_string)

class MainHandler(tornado.web.RequestHandler):
	def get(self):
		self.write(render('main'))

class SocketHandler(tornado.websocket.WebSocketHandler):
	def open(self):
		print("socket opened")
		global ALL_CONN
		ALL_CONN.append(self)
		pass
	def on_message(self,message):
		print("got message from client: %s" %(message))
		handle_server_message(json.loads(message))
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
