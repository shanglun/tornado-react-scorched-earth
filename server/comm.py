'''Methods to manage communication from client in the shiritori game'''
import json
from gamelogic import ShiriToriInstanceType

class ShiriToriCommType(object):
    '''Manages communication for shiritori game'''
    def __init__(self):
        '''Set up shiritori game instance'''
        self.shi = ShiriToriInstanceType()
    def register_socket(self, socket):
        '''Tell shiritori instance a player has entered'''
        self.shi.add_player(socket)

    def deregister_socket(self, socket):
        '''Tell shiritori instance a player logged off'''
        self.shi.remove_player(socket)

    def handle_server_message(self, socket, message_string):
        '''Relay server message to shiritori instance'''
        message = json.loads(message_string)
        if message['action'] == 'nextWord':
            self.shi.next_word(socket, message)
        elif message['action'] == 'getWords':
            self.shi.send_words(socket)
