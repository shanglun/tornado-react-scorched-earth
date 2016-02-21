'''Class types to manage game instances and handle communications from client'''
import json

class ShiriToriInstanceType(object):
    '''Manages a game of shiritori'''
    def __init__(self):
        '''Set words and players to be empty'''
        self.words = []
        self.players = []
    def add_player(self, socket):
        '''Add a player to player vector'''
        self.players.append(socket)
    def remove_player(self, socket):
        '''Called on player disconnect, remove the player'''
        self.players.remove(socket)
    def send_words(self, socket):
        '''When a player first logs in, give them all the words'''
        jstr = {'data':'allWords', 'words': self.words}
        socket.write_message(json.dumps(jstr))

    def check_next_word(self, nextword):
        '''Make sure the next word starts with the last char of the last word'''
        if len(self.words) == 0:
            return True
        lastword = self.words[-1]['word']
        return lastword[-1:].lower() == nextword[:1].lower()

    def next_word(self, socket, message):
        '''Proces a client entering the next word'''
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
        else:
            socket.write_message({
                'data': 'invalid message'
            })

SPAWN_XPOS = [100, 700, 300, 500]
TANK_RCS = ['Tank1', 'Tank2', 'Tank3', 'Tank4']
TURRET_RCS = ['Turret1', 'Turret2', 'Turret3', 'Turret4']
def maketank(tank_id, existing):
    '''Takes and tank id. Returns the information for a single tank
        if the tank is for a new player, place the tank higher'''
    ypos = 250
    if not existing:
        ypos = 200
    return {
        'xPos': SPAWN_XPOS[tank_id],
        'yPos': ypos,
        'TankRc': TANK_RCS[tank_id],
        'TurretRc': TURRET_RCS[tank_id],
        'serverId':tank_id
    }

def maketankgroup(tank_id):
    '''Make all the tanks that should be on the field currently'''
    ret = []
    for i in range(tank_id):
        ret.append(maketank(i, True))
    ret.append(maketank(tank_id, False))
    return ret

class TankInstanceType(object):
    '''represents a single tank game'''
    def __init__(self):
        '''Empty collections and default names for players'''
        self.players = []
        self.tanks = []
        self.playernames = ['player1', 'player2', 'player3', 'player4']
    def add_player(self, socket):
        '''Add socket to the game, send to socket information about existing tanks,
            and alert all existing players of the new player'''
        servid = len(self.players)
        #relay existing tanks
        socket.write_message(json.dumps({
            'command': 'makeTanks',
            'data': {
                'yourTank': servid,
                'tanks': maketankgroup(servid)
            }
        }))
        for i in range(len(self.players)):
            psocket = self.players[i]
            psocket.write_message(json.dumps({
                'command':'makeTanks',
                'data': {
                    'yourTank': i,
                    'tanks': [maketank(servid, False)]
                }
            }))
        self.players.append(socket)
        #print(self.playernames)
        for psocket in self.players:
            psocket.write_message(json.dumps({
                'command': 'playerName',
                'data': {
                    'names': self.playernames
                }
            }))
    def remove_player(self, socket):
        '''Remove player when socket connection dies'''
        self.players.remove(socket)
    def processmessage(self, src_socket, message):
        '''Process client messages if valid, otherwise alert client of invalid
            message'''
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
        elif message['action'] == 'setPlayerName':
            self.playernames[message['data']['id']] = message['data']['name']
            for socket in self.players:
                socket.write_message(json.dumps({
                    'command': 'playerName',
                    'data': {
                        'names': self.playernames
                    }
                }))
        else: #for potential debugging
            src_socket.write_message(json.dumps({
                'command': 'Error',
                'data':{
                    'error': 'invalid message'
                }
            }))
    def has_player(self, socket):
        '''Check if the socket belongs to a player in the game'''
        for psocket in self.players:
            if psocket == socket:
                return True
        return False

class TankInstanceManagerType(object):
    '''Manage adding and removing players, as well as relaying messages to there
        right game instance'''
    def __init__(self):
        '''Set up active games container, as well as initial game'''
        self.games = []
        self.activegame = TankInstanceType()
        self.max_players = 4
    def add_player(self, socket):
        '''Take player socket and add it to a game, or create
            a new game instance and add socket to the new game'''
        self.activegame.add_player(socket)
        if len(self.activegame.players) == self.max_players:
            self.games.append(self.activegame)
            self.activegame = TankInstanceType()

    def remove_player(self, socket):
        '''Given socket, find the game the socket belongs to'''
        if self.activegame.has_player(socket):
            self.activegame.remove_player(socket)
            return
        for game in self.games:
            if game.has_player(socket):
                game.remove_player(socket)
                if len(game.players) == 0:
                    self.games.remove(game)

    def processmessage(self, src_socket, message):
        '''Find the game that src_socket belongs to, an relay message
            to that game'''
        smessage = json.loads(message)
        if smessage['action'] == 'startGame':
            self.games.append(self.activegame)
            self.activegame = TankInstanceType()
        if self.activegame.has_player(src_socket):
            self.activegame.processmessage(src_socket, smessage)
            return
        for game in self.games:
            if game.has_player(src_socket):
                game.processmessage(src_socket, smessage)
                return
