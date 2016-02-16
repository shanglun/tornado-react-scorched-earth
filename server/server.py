'''Run a tornado server instance that is connected to the correct handlers'''
import signal
import tornado.httpserver
import tornado.ioloop
import tornado.options
from tornado.options import define, options

import handlers

CLOSING_KEY_PRESSED = False

def signal_handler(_, _unused):
    '''Set keyboard interrupt flag to exit'''
    del _
    del _unused
    global CLOSING_KEY_PRESSED
    CLOSING_KEY_PRESSED = True

def try_exit():
    '''If key board interrupt pressed, exit'''
    if CLOSING_KEY_PRESSED:
        tornado.ioloop.IOLoop.instance().stop()


define("port", default=8888, help="run on the given port", type=int)

def main():
    '''Run the server, periodically checking for keyboard interrupt'''
    tornado.options.parse_command_line()
    signal.signal(signal.SIGINT, signal_handler)
    application = tornado.web.Application(handlers.URL_MAP)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.PeriodicCallback(try_exit, 100).start()
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        tornado.ioloop.IOLoop.instance().stop()

if __name__ == "__main__":
    main()
