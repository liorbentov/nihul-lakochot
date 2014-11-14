var ADODB = require('node-adodb'),
connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=DBTry.mdb;');

ADODB.debug = false; 

exports.getTransferByClientId = function(clientID, res) {
     connection
    .query("select * from t_transfers t where t.ClientID = " + clientID)
    .on('done', function (data){
        transfer = data.records;
        for (var i = 0; i < transfer.length; i++) {
            for (curr in transfer[i]) {
                transfer[i][curr] = (transfer[i][curr] == 'null' ? '' : decodeURI(transfer[i][curr]));
            }
        };
      res.json(transfer);
    })
    .on('fail', function (data){
        return [{CardID: "daslkm"}];
    }); 
};

exports.getClientById = function(id, res) {
  connection
    .query("select * from t_clients t where t.CardID = " + id)
    .on('done', function (data){
        clients = data.records;
        for (var i = 0; i < clients.length; i++) {
            for (curr in clients[i]) {
                clients[i][curr] = (clients[i][curr] == 'null' ? '' : decodeURI(clients[i][curr]));
            }
        };
      res.json(clients);
    })
    .on('fail', function (data){
        return [{CardID: "daslkm"}];
    }); 
};

exports.insertTransfer = function(clientID, transferDate, amount, currency, commition, transferNumber, res) {
    var query = "INSERT INTO t_transfers (ClientID,TransferDate,MoneyAmount,TCurrency,Comm,TransferNumber) VALUES (";
        query += clientID + ", Format (" + transferDate + ", "dd/mm/yyyy"), " + amount + ", " + currency + ", ";
        query += commition + ", " + transferNumber + ")";
     connection
    .exec(query)
    .on('done', function (data){
        console.log(data);
        return data;
    })
    .on('fail', function (data){
        console.log(data);
        return data;
    }); 
};

exports.doNothing = function (req){
    console.log(req);
    return null;
};