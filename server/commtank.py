'''Relay message from socket to Tank game manager'''
from gamelogic import TankInstanceManagerType

class TankCommManager(object):
    '''Manage communication from tank url'''
    def __init__(self):
        '''Initialize tank instance manager'''
        self.manager = TankInstanceManagerType()

    def register_socket(self, socket):
        '''Ask the manager to add player on socket open message'''
        self.manager.add_player(socket)

    def deregister_socket(self, socket):
        '''Ask the manager to remove player on socket close message'''
        self.manager.remove_player(socket)

    def handle_server_message(self, socket, message_string):
        '''Send message to manager for proper distribution'''
        self.manager.processmessage(socket, message_string)
