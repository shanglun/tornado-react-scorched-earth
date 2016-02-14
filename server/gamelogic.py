import json


class ShiriToriInstanceType:
    def __init__(self):
        self.words = []
        self.players = []
    def add_player(self,socket):
        self.players.append(socket)
    def remove_player(self,socket):
        self.players.remove(socket)
    def send_words(self,socket):
        jstr = {'data':'allWords','words': self.words}
        socket.write_message(json.dumps(jstr))

    def check_next_word(self,nextword):
        if len(self.words) == 0:
            return True
        lastword = self.words[-1]['word']
        return lastword[-1:].lower() == nextword[:1].lower()

    def next_word(self,socket,message):
        if self.check_next_word(message['nextWord']):
            jstr = {
                'data': 'nextWord',
                'playerName': message['playerName'],
                'nextWord': message['nextWord']
            }
            self.words.append({
                'playerName':message['playerName'],
                'word': message['nextWord']
            })
            for conn in self.players:
                conn.write_message(json.dumps(jstr))

SPAWN_XPOS = [100,700,300,500]
TANK_RCS = ['Tank1', 'Tank2', 'Tank3', 'Tank4']
TURRET_RCS = ['Turret1', 'Turret2', 'Turret3', 'Turret4']
def maketank(id,existing):
    ypos = 250
    if not existing:
        ypos = 200
    return {
        'xPos': SPAWN_XPOS[id],
        'yPos': ypos,
        'TankRc': TANK_RCS[id],
        'TurretRc': TURRET_RCS[id],
        'serverId':id
    }

def maketankgroup(id):
    ret = []
    for i in range(id):
        ret.append(maketank(i,True))
    ret.append(maketank(id,False))
    return ret

class TankInstanceType:
    def __init__(self):
        self.players = []
        self.tanks = []
    def add_player(self,socket):
        servid = len(self.players)
        print('adding player, server id %d'%servid)
        #relay existing tanks
        socket.write_message(json.dumps({
            'command': 'makeTanks',
            'data': {
                'yourTank': servid,
                'tanks': maketankgroup(servid)
            }
        }))
        #let existing players know
        for i in range(len(self.players)):
            print('sending maketank to existing player %d' %i)
            psocket = self.players[i]
            psocket.write_message(json.dumps({
                'command':'makeTanks',
                'data': {
                    'yourTank': i,
                    'tanks': [maketank(servid, False)]
                }
            }))
        #save player socket
        self.players.append(socket)
    def remove_player(self,socket):
        self.players.remove(socket)
    def processmessage(self,src_socket, message):
        message = json.loads(message)
        if message['action'] == 'shoot':
            for socket in self.players:
                socket.write_message(json.dumps({
                    'command':'shoot',
                    'data': {
                        'shooterId': message['shooterId'],
                        'shootForce': message['shootForce'],
                        'rotation': message['rotation'],
                        'xPos': message['xPos'],
                        'yPos': message['yPos']
                    }
                }))
        elif message['action'] == 'startGame':
            for socket in self.players:
                socket.write_message(json.dumps({
                    'command':'startGame'
                }))
    def restart(self):
        pass
