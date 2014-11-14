var express = require('express');
var players = require('./shtuty');
var clients = require('./client');
var transfers = require('./transfer');

var app = express();
var port = process.env.PORT || 3333;
//var router = express.Router();

// router.use(function(req, res, next) {
//   console.log('%s %s', req.method, req.path);
//   next();  
// });

app.get('/countries', function (req, res) {
  res.json(players.getAllCountries());
});

app.get('/clients', function (req, res) {
  if (req.query.phone){
  	clients.getClientByPhone(req.query.phone, res);
  }
  else if (req.query.id){
  	clients.getClientById(req.query.id, res);
  }
  else if (req.query.country){
  	clients.getClientByCountry(req.query.country, res);
  }
  else{
  	clients.getAllClients(res);
  }
});

app.put('/clients', function (req, res){
  res.send(clients.updateClient(req));
})

app.put('/clients/delete/:id', function (req, res){
  clients.deleteClient(req.params.id, res);
})

app.get('/transfers', function (req, res) {
  if (req.query.clientID){
    transfers.getTransfersByClientId(req.query.clientID, res);
  }
  if (req.query.transferID){
    transfers.getTransferByTransferId(req.query.transferID, res);
  }
});

app.post('/transfers/add/:id', function (req, res){
  res.send(transfers.insertTransfer(req.params.id, req.query.TransferDate, req.query.MoneyAmount, 
                           req.query.TCurrency, req.query.Comm, req.query.TransferNumber));
});

app.put('/transfers/update/:id', function (req, res){
  res.send(transfers.updateTransfer(req.query));
});

app.put('/transfers/delete/:id', function (req, res){
  res.send(transfers.deleteTransfer(req.query));
});

app.get('/clients/:id', function (req, res, next) {
  var client = clients.getClientById(req.params.id);
  res.send(client);
});

// Only requests to /api/ will be send to router.
app.use(express.static('public'));
//app.use('/api', router);
app.listen(port);
console.log('Server listening on port ' + port);

