const fs = require('fs');
const path = require('path');
const http = require('http');

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