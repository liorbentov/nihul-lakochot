var ADODB = require('node-adodb'),
connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=DBTry.mdb;');

ADODB.debug = false; 

exports.getTransfersByClientId = function(clientID, res) {
    connection
        .query("select * from t_transfers t where t.deleted = false and t.ClientID = " + clientID)
        .on('done', function (data){
            transfer = data.records;
            for (var i = 0; i < transfer.length; i++) {
                for (curr in transfer[i]) {
                    transfer[i][curr] = (transfer[i][curr] == 'null' ? '' : decodeURIComponent(transfer[i][curr]));
                }
            };
            res.json(transfer);
        })
        .on('fail', function (data){
            return [{CardID: "daslkm"}];
        }); 
};

exports.getTransferByTransferId = function(transferID, res) {
    connection
        .query("select * from t_transfers t where t.deleted = False and t.transferID = " + transferID)
        .on('done', function (data){
            transfer = data.records;
            var date = new Date(decodeURIComponent(transfer[0]["TransferDate"]));
            var formattedDate = (date.getDate() < 10 ? "0" : "") + date.getDate() + '/' + 
                ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1) + '/' +  date.getFullYear();    
            for (curr in transfer[0]) {
                if (curr == 'TCurrency') {
                    if (transfer[0][curr] == "null") {
                        transfer[0][curr] = null;
                    }
                    else {
                        transfer[0][curr] = decodeURIComponent(transfer[0][curr]);
                    }
                }
                else {
                    transfer[0][curr] = (transfer[0][curr] * 1);
                }
            };

            transfer[0].TransferDate = formattedDate;
            res.json(transfer);
        })
        .on('fail', function (data){
            return [{CardID: "daslkm"}];
        }); 
};

exports.insertTransfer = function(clientID, transferDate, amount, currency, commition, transferNumber) {
    var query = "INSERT INTO t_transfers (ClientID,TransferDate,MoneyAmount,TCurrency,Comm,TransferNumber, deleted) VALUES (";
        query += clientID + ", '" + transferDate + "', " + amount + ", '";
        query += currency + "', ";
        query += commition + ", " + transferNumber + ", False)";
     connection
    .execute(query)
    .on('done', function (data){
        return data;
    })
    .on('fail', function (data){    
        return data;
    }); 
};

exports.updateTransfer = function(transfer) {
    var query = "UPDATE t_transfers set TransferDate = '" + transfer.TransferDate +  "', MoneyAmount = " + transfer.MoneyAmount;
        query += ", TCurrency = '" + (transfer.TCurrency == undefined ? "" : transfer.TCurrency) + "', Comm = " + transfer.Comm;
        query += ", TransferNumber = " + transfer.TransferNumber + " where TransferID = " + transfer.TransferID;
     connection
        .execute(query)
        .on('done', function (data){
            return data;
        })
        .on('fail', function (data){    
            console.log("fail" + data.message);
            return data;
        }); 
};

exports.deleteTransfer = function(transfer) {
    var query = "UPDATE t_transfers set deleted = True where TransferID = " + transfer.TransferID;
     connection
        .execute(query)
        .on('done', function (data){
            return data;
        })
        .on('fail', function (data){    
            console.log("fail" + data.message);
            return data;
        }); 
};