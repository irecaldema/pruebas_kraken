'use strict';

var IndexModel = require('../models/index');
//var userModel = require('../models/userModel');
var Usuario = require('../models/Usuario');
//var Usuario = require('../models/Usuario2');
var bcrypt = require('bcrypt');

//var md5 = require('md5');

module.exports = function (router) {

    var model = new IndexModel();
    //var Usuario = new userModel();

    router.get('/', function (req, res) {  
        res.render('login', model);  
    });    
    
    router.get('/home', function (req, res) {  
        res.render('home', model);     
    });
    
    // login usuario
    router.post('/login', function (req, res) {
        var form_usuario=req.body.usuario;
        var form_pass=req.body.pass;
        
        //encriptacion en hash
        //var salt = bcrypt.genSaltSync(10);
        //var pass_coded = bcrypt.hashSync(form_pass, salt);
        //form_pass=md5(form_pass);
        
        console.log("Usuario login: " +form_usuario);
        //console.log("Pass login: " +pass_coded);
        console.log("Pass login: " +form_pass);
        
        
        /*// Load password hash from DB
        bcrypt.compare("my password", hash, function(err, res) {
            // res === true
        });
        bcrypt.compare("not my password", hash, function(err, res) {
            // res === false
        });*/

        
        //buscar usuario en base de datos y si esta validado cookie de sesion mas redirijir a home
        //Usuario.findOne({ usuario: form_usuario, pass: pass_coded }, function (err, usuario) {
        Usuario.findOne({ usuario: form_usuario }, function (err, usuario) {
        //Usuario.find(function (err, users) {    
            if (err) {
                console.error(err);
            } 
            
            /*var model = {
                usuarios: usuario
            };*/
            if(usuario!=null){
                console.log('Find one usuario:'+usuario.usuario);
                //console.log(usuario.comp_validacion());
                //res.json(Usuario);

                usuario.comparePassword(form_pass, function(err, isMatch){
                    if (err) throw err;
                    /*if (err) {
                        console.log("Error");
                    };*/
                    console.log('comprobacion: '+form_pass, isMatch);
                    //redireccionar
                    if (isMatch){
                        if(usuario.validated){
                            res.redirect('/home');
                        }else{
                            res.redirect('/'); 
                        } 
                    }else{
                        res.redirect('/'); 
                    }                     
                });  
            }else{
                res.redirect('/'); 
            }    
        });    
        
    });
    // registrar usuario
    router.post('/register', function (req, res) {
        var form_usuario = req.body.usuario;
        var form_email = req.body.email;
        var form_pass = req.body.pass;
        var form_pass2 = req.body.pass2;
        
        var salt = bcrypt.genSaltSync(10);
        var pass_coded = bcrypt.hashSync(form_pass, salt);
        console.log(bcrypt.compareSync(form_pass2, pass_coded));
        console.log(pass_coded);
        
        console.log(form_usuario);
        console.log(form_email);
        console.log(form_pass);
        console.log(form_pass2);
        
        if (bcrypt.compareSync(form_pass2, pass_coded)){
            var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            var new_key = "";
            for (var i = 0; i < 32; i++) {
                new_key += chars[Math.floor(Math.random()*35)];
            }
            // Mailgun
            var api_key = 'key-116da3f3cd011ad01d454a632a599587';
            var domain = 'sandboxe7f47692877a4fd6b2115e79c3ce660d.mailgun.org';
            var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
            
            var mensaje = "<h1>Hola " + form_usuario + "!</h1><br><p>Gracias por registrarse en nuestro sitio.<br>Su cuenta ha sido creada, y debe ser activada antes de poder ser utilizada.<br>Para activar la cuenta, haga click en el siguiente enlace o copielo en la barra de direcciones del navegador:</p><br><a href='https://kraken-pruebas-zubiri.c9users.io/activate/"+new_key+"/"+form_email+"'>Activar la cuenta</a>";
            
            var data = {
              from: 'App-Tracking DW32-IGSR <postmaster@sandboxe7f47692877a4fd6b2115e79c3ce660d.mailgun.org>',
              to: form_email,
              subject: 'Registro en App-Tracking',
              html: mensaje
            };
            
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });
            
            console.log("key: " + new_key);
            
            var usuario = new Usuario({ usuario : form_usuario, pass : pass_coded, email : form_email, activacion_key : new_key, validated : 0});
            
            usuario.save(function (err) {
                if (err) {
                    console.log('save error', err);
                }
            });
            
        } else {
            console.log('Las pass no es la misma');
        }
    }); 
    
    router.get('/activate/:activation/:email', function (req, res) {
        
        var key = req.params.activation;
        var email = req.params.email;
        console.log("activacion de usuario");
        console.log("key: " + key);
        console.log("Email: " + email);
        
        Usuario.findOne({activacion_key: key, email: email}, function (err, usuario) {
            if (err) {
                console.log(err);
            } else if (usuario!=null) {
                //update de usuario
                console.log("busqueda de usuario en activacion");
                console.log(usuario.usuario);
                console.log(usuario.email);
                console.log(usuario.activacion_key);
                console.log(usuario.validated);
                console.log(usuario.comp_validacion());
                
                //en proceso
                usuario.validated = true;
                usuario.save(function (err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log('Updated', usuario);
                    }
                });
            } else {
                console.log('Usuario no encontrado');
            }
        });
        
        
        /*
        var User = mongoose.model('User', {name: String, roles: Array, age: Number});

        //Lets try to Find a user
        User.findOne({name: 'MODULUS ADMIN2'}, function (err, userObj) {
          if (err) {
            console.log(err);
          } else if (userObj) {
            console.log('Found:', userObj);
        
            //For demo purposes lets update the user on condition.
            if (userObj.age != 30) {
              //Some demo manipulation
              userObj.age += 30;
        
              //Lets save it
              userObj.save(function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Updated', userObj);
                }
              });
            }
          } else {
            console.log('User not found!');
          }
        }
        */
        
        /*
        $db = $m->selectDB('app_tracking');
        $collection = $db->usuarios;
        $mongo_usuarioKey=array("activacion_key" => "$activation_key", "email" => "$email");
        $total = $collection->count($mongo_usuarioKey);
        
        if ($total == 1) {
            //echo "<br>hay";
                $db = $m->selectDB('app_tracking');
                $collection = $db->usuarios;
                $newdata = array('$set' => array("validated" => 1));
                //$collection->update(array("activacion_key" => "$activation_key"), $newdata);
                $collection->update(array("activacion_key" => "$activation_key", "email" => "$email"), $newdata);
        
            ob_start();
        		header('refresh: 3; ../');
        		echo "<br>¡Bienvenido!";
        		echo "Tu cuenta ha sido activada.";
        		ob_end_flush();
        } else {
            echo "<br>Error en la activacion de la cuenta.";
        }*/
        
        
        res.redirect('/');
    
    }); 
    
    
};