from gamelogic import TankInstanceManagerType

si = TankInstanceManagerType()


def register_socket(socket):
    global si
    si.add_player(socket)

def deregister_socket(socket):
    global si
    si.remove_player(socket)

def handle_server_message(socket, message_string):
    global si
    si.processmessage(socket, message_string)
