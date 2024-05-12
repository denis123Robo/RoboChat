const fs = require('fs');
const path = require('path');
const http = require('http');
const db = require('./database')

const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const StyleFile = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const ScriptJsFile = fs.readFileSync(path.join(__dirname, 'static', 'script.js'));
const server = http.createServer((req,res) => {
    if(req.method == 'GET') {
        switch(req.url) {
            case '/': return res.end(indexHtmlFile);
            case '/style.css': return res.end(StyleFile);
            case '/script.js': return res.end(ScriptJsFile);
        }
    }
    res.statusCode = 404;
    return res.end('Error 404');
});
server.listen(3000);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', async (socket) => {
    console.log('a user connected. id - ' + socket.id) ;
    
        let userNickname = 'admin';
        let messages = await db.getMessages();

        socket.emit('all_messages', messages);

        socket.on('new_message', (message) => {
            db.addMessage(message, 1);
            io.emit('message', userNickname + ' : ' + message);
        });
    });
