import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
 
listeners = []
 
class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
        listeners.append(self)
      
    def on_message(self, message):
        print 'message received %s' % message
        for w in listeners:
            w.write_message(message)
        # self.write_message(message)
 
    def on_close(self):
      print 'connection closed'
      listeners.remove(self)
 
 
application = tornado.web.Application([
    (r'/ws', WSHandler),
])
 
 
if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(443)
    tornado.ioloop.IOLoop.instance().start()
