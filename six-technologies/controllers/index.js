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

    /*router.get('/', function (req, res) {  
        res.render('index', model);     
    });*/
    
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
        console.log(form_pass);
        
        //encriptacion en hash
        var salt = bcrypt.genSaltSync(10);
        var pass_coded = bcrypt.hashSync(form_pass, salt);
        //form_pass=md5(form_pass);
        
        console.log(form_usuario);
        console.log(pass_coded);
        
        //buscar usuario en base de datos y si esta validado cookie de sesion mas redirijir a home
        Usuario.findOne({ usuario: form_usuario, pass: pass_coded }, function (err, usuario) {
        //Usuario.find(function (err, users) {    
            if (err) {
                console.error(err);
            } 
            
            /*var model = {
                usuarios: usuario
            };*/
            if(usuario!=null){
                console.log('Find one usuario:'+usuario.usuario);
                //Usuario.whoAmI;
                console.log(usuario.comp_validacion);
                //res.json(Usuario);
                if(usuario.validated){
                    //guardar sesion en cookie y redirigir
                    //res.render('home', model);
                    //redireccionar
                    res.redirect('/home');
                }else{
                    res.render('login', model); 
                } 
            }else{
                res.render('login', model); 
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
};
