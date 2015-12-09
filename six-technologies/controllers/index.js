'use strict';

var IndexModel = require('../models/index');
//var userModel = require('../models/userModel');
var Usuario = require('../models/Usuario');
//var Usuario = require('../models/Usuario2');

var md5 = require('md5');

module.exports = function (router) {

    var model = new IndexModel();
    //var Usuario = new userModel();

    /*router.get('/', function (req, res) {  
        res.render('index', model);     
    });*/
    
    router.get('/', function (req, res) {  
        res.render('login', model);     
    });    

    router.post('/', function (req, res) {
        //var Usuario = new Usuario();
        var form_usuario=req.body.usuario;
        var form_pass=req.body.pass;
        console.log(form_pass);
        form_pass=md5(form_pass);
        
        console.log(form_usuario);
        console.log(form_pass);
        
        //buscar usuario en base de datos y si esta validado cookie de sesion mas redirijir a home
        Usuario.findOne({ usuario: form_usuario, pass: form_pass }, function (err, usuario) {
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
                    res.render('home', model); 
                }else{
                    res.render('login', model); 
                } 
            }else{
                res.render('login', model); 
            }    
        });    
        
    });
};
