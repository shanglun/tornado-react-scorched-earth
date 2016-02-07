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
        lastword = self.words[-1]
        return lastword[-1:].lower() == nextword[:1].lower()

    def next_word(self,socket,nextword):
        if self.check_next_word(nextword):
            jstr = {'data': 'nextWord','nextWord': nextword}
            self.words.append(nextword)
            for conn in self.players:
                conn.write_message(json.dumps(jstr))
