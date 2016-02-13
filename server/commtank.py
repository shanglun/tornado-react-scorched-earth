import json
from gamelogic import TankInstanceType

si = []#TankInstanceType()


def register_socket(socket):
    global si
    si.append(socket)
    #si.add_player(socket)

def deregister_socket(socket):
    global si
    #si.remove_player(socket)
    si.remove(socket)

def handle_server_message(socket,message_string):
    global si
    message = json.loads(message_string)
    if message['action'] == 'beginTank':
        socket.write_message(json.dumps({
            'command': 'makeTanks',
            'data': {
                'tanks': [
                    {
                        'xPos':200,
                        'yPos':200,
                        'TankRc': 'Tank1',
                        'TurretRc': 'Turret1',
                        'serverId': 1
                    },{
                        'xPos':600,
                        'yPos':200,
                        'TankRc': 'Tank2',
                        'TurretRc': 'Turret2',
                        'serverId': 2
                    }
                ]
            }
        }))
        #allocate id and send it over.
    if message['action'] == 'shoot':
        for tsocket in si:
            tsocket.write_message(json.dumps({
                'command':'shoot',
                'data': {
                    'shooterId': message['shooterId'],
                    'shootForce': message['shootForce'],
                    'rotation': message['rotation'],
                    'xPos': message['xPos'],
                    'yPos': message['yPos']
                }
            }))
        pass
    elif message['action'] == 'tankKilled':
        pass
