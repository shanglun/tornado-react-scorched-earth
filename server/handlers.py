'''Define Tornado handlers for Shiritori game and Tank game'''
import tornado.web
import tornado.websocket
from render_template import render
import comm
import commtank

class MainHandler(tornado.web.RequestHandler):
    '''Serves the http page'''
    def get(self):
        self.write(render('main'))
    def data_received(self, data):
        '''Override abstract function to please pylint'''
        pass

class ShiriToriSocketHandler(tornado.websocket.WebSocketHandler):
    '''Manage sockets from the Shiritori game url'''
    def __init__(self):
        '''Start a shiritori game message handler'''
        super(self.__class__, self).__init__()
        self.comm = comm.ShiriToriCommType()
    def open(self):
        '''Send new socket information to game message handler'''
        self.comm.register_socket(self)
    def on_message(self, message):
        '''Relay message to the shiritori game message handler'''
        self.comm.handle_server_message(self, message)
    def on_close(self):
        '''Tell shiritori game message handler a socket closed.'''
        self.comm.deregister_socket(self)
    def data_received(self, data):
        '''Please pylint'''
        pass

class TankSocketHandler(tornado.websocket.WebSocketHandler):
    '''Handles socket communication for the tank game url'''
    def open(self):
        '''Tell the tank game handler that socket has opened'''
        commtank.register_socket(self)
    def on_message(self, message):
        '''Relay message to the tank message handler'''
        commtank.handle_server_message(self, message)
    def on_close(self):
        '''Tell tank message handler that a socket closed'''
        commtank.deregister_socket(self)
    def data_received(self, data):
        '''Please pylint'''
        pass

URL_MAP = [
	   (r"/", MainHandler), (r"/socket", ShiriToriSocketHandler),
	   (r"/socket/tank", TankSocketHandler),
	   (r"/static/(.*)", tornado.web.StaticFileHandler, {'path':'./static'}),
	   (r"/static/rcs/(.*)", tornado.web.StaticFileHandler, {'path':'./static/rcs'}),
	   (r"/(output.js)", tornado.web.StaticFileHandler, {'path':'../client/output'})]
