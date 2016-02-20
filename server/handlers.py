'''Define Tornado handlers for Shiritori game and Tank game'''
import tornado.web
import tornado.websocket
from render_template import render
import comm
import commtank

class MainHandler(tornado.web.RequestHandler):
    '''Serves the http page'''
    def get(self):
        self.write(render('main', {}))
    def data_received(self, data):
        '''Override abstract function to please pylint'''
        pass

class ShiriToriSocketHandler(tornado.websocket.WebSocketHandler):
    '''Manage sockets from the Shiritori game url'''
    '''Create a static comm type to be shared across sessions.'''
    scomm = comm.ShiriToriCommType()
    def open(self):
        '''Send new socket information to game message handler'''
        self.scomm.register_socket(self)
    def on_message(self, message):
        '''Relay message to the shiritori game message handler'''
        self.scomm.handle_server_message(self, message)
    def on_close(self):
        '''Tell shiritori game message handler a socket closed.'''
        self.scomm.deregister_socket(self)
    def data_received(self, data):
        '''Override abstract function to please pylint'''
        pass

class TankSocketHandler(tornado.websocket.WebSocketHandler):
    '''Handles socket communication for the tank game url'''
    '''Create a static comm type to be shared across sessions.'''
    tcomm = commtank.TankCommManager()
    def open(self):
        '''Tell the tank game handler that socket has opened'''
        self.tcomm.register_socket(self)
    def on_message(self, message):
        '''Relay message to the tank message handler'''
        self.tcomm.handle_server_message(self, message)
    def on_close(self):
        '''Tell tank message handler that a socket closed'''
        self.tcomm.deregister_socket(self)
    def data_received(self, data):
        '''Override abstract function to please pylint'''
        pass

URL_MAP = [
	   (r"/", MainHandler), (r"/socket", ShiriToriSocketHandler),
	   (r"/socket/tank", TankSocketHandler),
	   (r"/static/(.*)", tornado.web.StaticFileHandler, {'path':'./static'}),
	   (r"/static/rcs/(.*)", tornado.web.StaticFileHandler, {'path':'./static/rcs'}),
	   (r"/(output.js)", tornado.web.StaticFileHandler, {'path':'../client/output'})]
