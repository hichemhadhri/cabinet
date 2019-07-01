var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var io = require('socket.io')(http);

app.use(express.static("."));




var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function ajouter(req,res){
  var today = new Date();
 var dd = String(today.getDate()).padStart(2, '0');
 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
 var yyyy = today.getFullYear();
 var prenom =req.body.prenom.replace(/\s/g, '');
   var nom =req.body.nom.replace(/\s/g, '');
var name;
  var nomTable = nom+prenom;
 today = dd + '/' + mm + '/' + yyyy;
 if(req.body.prenom==''){
   name=req.body.nom;
 }else {
   name=req.body.nom + " " + req.body.prenom;
 }
   var values =  [[name, req.body.age,req.body.adresse, req.body.telephone, req.body.notes,today]];
    var sql = "INSERT INTO ?? (nom,age,adresse,telephone,notes,date) VALUES ?";
  con.query(sql, [nomTable,values], function (err, result) {
    if (err) throw err;

    console.log("informations patient ajoutes!");
  });
  res.redirect('/');
}
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nabilbolbol123",
  database: "patients"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// viewed at http://localhost:8080
app.get('/', function(req, res) {


    res.sendFile(path.join(__dirname + '/mainmenu.html'));

});

app.get('/calendrier.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/calendrier.html/'));


});
app.get('/newfich/',function(req,res)
{
  console.log("bouton is pressed");
  res.sendFile(path.join(__dirname + '/newfich.html'));

});
// ajouter un nouveau patient
app.post('/nouveau/',urlencodedParser,function(req,res){
  console.log(req.body);
  console.log("patient va etre ajouté");
  var sql1 = "CREATE TABLE ?? (nom VARCHAR(255), age VARCHAR(255), adresse VARCHAR(255), telephone VARCHAR(255), notes LONGTEXT,date VARCHAR(255))";
  var prenom =req.body.prenom.replace(/\s/g, '');
    var nom =req.body.nom.replace(/\s/g, '');

   var nomTable = nom+prenom;
   con.query(sql1,[nomTable],function(err,result){
     if (err) throw err;

     console.log("patient ajoute!");
   });

ajouter(req,res);

});
// search existant patient
app.post('/search/',urlencodedParser,function(req,res){
    var enom =req.body.enom.replace(/\s/g, '');
    console.log(enom);
    console.log(req.body.enom);
  con.query("SELECT * FROM ?? WHERE nom = '"+ req.body.enom + "'",[enom],function (err, result) {
     if (err) throw err;
     console.log(result.length);
     console.log(result[0]);
     res.render('fiche.ejs', {patient:result});
   });
   io.sockets.on('connection',function(socket){
     console.log("user connected");
     socket.on('bouton',function(msg){
       con.query("SELECT * FROM ?? WHERE date = '"+ msg + "'",[enom],function (err, result) {
          if (err) throw err;
          console.log(result[0]);
          socket.emit('consultation',result[0]);
     });
   });
 });
});
// update current fiche for existing patient
app.post('/update/:name',urlencodedParser,function(req,res){
  console.log("une consultation va etre ajoute");
   ajouter(req,res);
});

 // store les rendez vous dans la base de donnee
 var con2 = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "Nabilbolbol123",
   database: "rdv"
 });

io.sockets.on('connection',function(socket){
  console.log("prise de rende-vous");
  socket.on('nvrdv',function(rdv){
    console.log('un nouveau rendez vous le  ' +  rdv.start );
    var values = [["evenement", rdv.start, rdv.end]];
    var sql = "INSERT INTO events (title,start,end) VALUES ?";
  con2.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("redv ajouté");
    });
 });
});


// load events from the database
app.get('/events/',function(req,res){
    con2.query("SELECT * FROM events", function(err,result){
      if(err) throw err;
      console.log("on veut les evenements");

      res.send(result);
    });
});
http.listen(8080);
