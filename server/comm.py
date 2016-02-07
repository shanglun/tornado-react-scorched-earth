import json
from gamelogic import ShiriToriInstanceType

si = ShiriToriInstanceType()

def register_socket(socket):
    global si
    si.add_player(socket)

def deregister_socket(socket):
    global si
    si.remove_player(socket)

def handle_server_message(socket,message_string):
    global si
    message = json.loads(message_string)
    if message['action'] == 'nextWord':
        si.next_word(socket,message['nextWord'])
    elif message['action'] == 'getWords':
        si.send_words(socket)
