var ADODB = require('node-adodb'),
connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=DBTry.mdb;');

ADODB.debug = true;

// connection
//     .execute('INSERT INTO t_countries VALUES ("Tel-Aviv")')
//     .on('done', function (data){
//         console.log('Result:'.green.bold, JSON.stringify(data, null, '  ').bold);
//     })
//     .on('fail', function (data){
//         // TODO something
//     });
  connection
    .query("select * from t_countries")
    .on('done', function (data){
        countries = data.records;
    })
    .on('fail', function (data){
        // TODO something
    });  
exports.getAllCountries = function() {
  for (var i = 0; i < countries.length; i++) {
       countries[i].CountryName = decodeURI(countries[i].CountryName);
   }; 
  return countries;
};

exports.getPlayerById = function(id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == id) return players[i];
  }
};    