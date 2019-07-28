const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);


// Long polling example 
// https://gist.github.com/swdunlop/192d8b5e0f00a900cf88
const defers = [];
const messages = [

];

function resolvePromises() {
  const pulledMessages = messages.splice(0, messages.length);
  defers.splice(0, defers.length).forEach(defer => {
    defer.res.json(pulledMessages);
  })
}

app.use(bodyParser.json());

app.put('/submit', (req, res) => {
  if (req.body && req.body.text) {
    messages.push(req.body.text);
    resolvePromises();
  }
  res.json({'ok': true});
});

app.get('/messages', (req, res) => {
  defers.push({req, res});
});

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.json({'hello': 'world'});
  }, 1000);
  
})

app.use(express.static('public'));

setInterval(() => {
  messages.push(new Date().toTimeString() + ' - Event! --- ' + Math.random().toString(16).slice(2));
  resolvePromises();
}, 500);

server.listen(8080, () => console.log(`app listening on http://localhost:8080`));