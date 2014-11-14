var ADODB = require('node-adodb'),
connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=DBTry.mdb;');

ADODB.debug = true; 

exports.getAllClients = function(res) {
  connection
    .query("select * from t_clients t where t.CardID between 1000 and 2000")
    .on('done', function (data){
    clients = data.records;
    for (var i = 0; i < clients.length; i++) {
    for (curr in clients[i]) {
        clients[i][curr] = (clients[i][curr] == 'null' ? '' : 
          (curr == 'CardID' ?  clients[i][curr] : decodeURIComponent(clients[i][curr])));
    }
    };
      res.json(clients);
    })
    .on('fail', function (data){
      return [{CardID: "daslkm"}];
    }); 
};

exports.getClientById = function(id, res) {
  connection
    .query("select * from t_clients t where t.CardID = " + id + " and t.logicDelete = false")
    .on('done', function (data){
        clients = data.records;
        for (var i = 0; i < clients.length; i++) {
            for (curr in clients[i]) {
                clients[i][curr] = (clients[i][curr] == 'null' ? '' : 
                  (curr == 'CardID' ?  clients[i][curr]*1 : decodeURIComponent(clients[i][curr])));
            }
        };
      res.json(clients);
    })
    .on('fail', function (data){
        return [{CardID: "daslkm"}];
    }); 
};

exports.getClientByCountry = function(country, res) {
  var query = "select * from t_clients t where LCase(t.country) = '" + country + "' ";
  query += "or LCase(t.country) like '%" + country + "%'"
  connection
    .query(query)
    .on('done', function (data){
      clients = data.records;
      for (var i = 0; i < clients.length; i++) {
        for (curr in clients[i]) {
          clients[i][curr] = (clients[i][curr] == 'null' ? '' : 
            (curr == 'CardID' ?  clients[i][curr]*1 : decodeURIComponent(clients[i][curr])));
        }
      };
      res.json(clients);
    })
    .on('fail', function (data){
      return [];
    }); 
};

exports.getClientByPhone = function(phone, res) {
  connection
    .query("select * from t_clients t where t.logicDelete = false and (t.phone like '%"+ phone +"%' or t.phone2 like '%"+ phone +"%' or t.phone3 like '%"+ phone +"%')")
    .on('done', function (data){
    clients = data.records;
    for (var i = 0; i < clients.length; i++) {
    for (curr in clients[i]) {
      if (clients[i][curr] == 'null'){
        clients[i][curr] = '';
      }
      else if (clients[i][curr] == 'true'){
        clients[i][curr] = true;
      }
      else if (clients[i][curr] == 'false'){
        clients[i][curr] = false; 
      }
      else if (curr == 'CardID'){
        clients[i][curr] = clients[i][curr] * 1; 
      }
      else{
        clients[i][curr] = decodeURIComponent(clients[i][curr]);
      }
    }
    };
      res.json(clients);
    })
    .on('fail', function (data){
      return [{CardID: "daslkm"}];
    }); 
};   

exports.updateClient = function(req){
  var query = "update t_clients set id = '" + req.query.id + "', id2 = '" + req.query.id2 + "'";
  query += ", firstname = '" + req.query.firstname + "', lastname = '" + req.query.lastname + "'";
  query += ", birthdate = '" + req.query.birthdate + "', country = '" + req.query.country + "', ";
  query += "phone = '" + req.query.phone + "', phone2 = '" + req.query.phone2 + "', phone3 = '" + req.query.phone3 + "'";
  query += ", Notes = '" + req.query.Notes + "', PassportChecked = " + req.query.PassportChecked;
  query += ", gender = '" + req.query.gender + "' where CardID = " + req.query.CardID;
  connection
    .execute(query)
    .on('done', function (data){
      return true;
    })
    .on('fail', function (data){
      return false;
    })
}

exports.deleteClient = function(id, res){
  var query = "update t_clients set logicDelete = true where CardID = " + id;
  connection
    .execute(query)
    .on('done', function (date){
      res.json({"success" : "הפעולה בוצעה בהצלחה"});
    })
    .on('fail', function (data){
      res.json({"error" : "התרחשה תקלה"});
    })
}