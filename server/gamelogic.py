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
