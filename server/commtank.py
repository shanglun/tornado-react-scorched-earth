import json
from gamelogic import TankInstanceType

si = TankInstanceType()

def register_socket(socket):
    global si
    si.add_player(socket)

def deregister_socket(socket):
    global si
    si.remove_player(socket)

def handle_server_message(socket,message_string):
    global si
    message = json.loads(message_string)
    if message['action'] == 'beginTank':
        print("beingTank message received")
        socket.write_message(json.dumps({
            'command': 'makeTanks',
            'data': {
                'tanks': [
                    {
                        'xPos':200,
                        'yPos':200,
                        'TankRc': 'Tank1',
                        'TurretRc': 'Turret1'
                    },{
                        'xPos':600,
                        'yPos':200,
                        'TankRc': 'Tank2',
                        'TurretRc': 'Turret2'
                    }
                ]
            }
        }))
        pass
    elif message['action'] == 'tankKilled':
        pass
