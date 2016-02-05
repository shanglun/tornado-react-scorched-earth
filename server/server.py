import tornado.httpserver
import tornado.ioloop
import tornado.options

import signal
import handlers

from tornado.options import define, options

is_closing = False

def signal_handler(signum, frame):
	global is_closing
	is_closing = True
		
def try_exit():
	global is_closing
	if is_closing:
		tornado.ioloop.IOLoop.instance().stop()
		

define("port",default=8888,help="run on the given port", type=int)

def main():
	tornado.options.parse_command_line()
	signal.signal(signal.SIGINT,signal_handler)
	application = tornado.web.Application(handlers.urlmap)
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(options.port)
	tornado.ioloop.PeriodicCallback(try_exit,100).start()
	try:
		tornado.ioloop.IOLoop.instance().start()
	except KeyboardInterrupt:
		tornado.IOLoop.instance().stop()
	
if __name__ == "__main__":
	main()