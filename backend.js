const express = require('express');
const http = require('http');
const Server = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const server = Server(httpServer);

const port = 3000;

const players = {};

let aId = 0;

app.use(express.static('./'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

server.on('connection', (socket) => {
   if(aId == 0){
       aId = socket.id + '';
   }
   else{
       players[aId] = {
           number: 1,
           rival: socket.id
       }
       players[socket.id] = {
           number: 2,
           rival: aId
       }
       aId = 0;
       
       server.to(players[socket.id].rival).emit('startGame', (players));
       server.to(socket.id).emit('startGame', (players));
   }
   
   socket.on('sendTurn', (game) => {
       server.to(players[socket.id].rival).emit('playTurn', game);
                
   })
   socket.on('disconnect', () => {
       delete players[socket.id];
   })
});

function ping(){
    let url = "https://multiplayer-web-game.onrender.com/";
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.addEventListener("load", (e)=>{
         console.log(e.target.status);
    });
    req.send(null);
}   

setInterval(ping, 20000);

httpServer.listen(port);

