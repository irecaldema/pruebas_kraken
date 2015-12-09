'use strict';

var mongoose = require('mongoose');

var userModel = function () {
    
    //pendiente de retocar
    var userSchema = new mongoose.Schema({
        usuario: String,
        pass: String,
        email: String,
        activacion_key: String,
        validated: Boolean
    },{collection : 'usuarios'});
    //var usuario = mongoose.model('Usuario', userSchema);
    //var User = mongoose.model('User', {name: String, roles: Array, age: Number});
    
    //ejemplo funcion
    /*userSchema.methods.whoAmI = function () {
        var greeting = this.usuario ?
            'Hello, I\'m a ' + this.usuario + ' and email ' + this.email
            : 'I don\'t have a name :(';
        console.log(greeting);
    }; */ 
    
    userSchema.methods.comp_validacion = function () {
        if(this.validated){
            return 'esta validado';
        }else{
            return 'no esta validado';
        }
    };
    
    return mongoose.model('Usuario', userSchema);
};

module.exports = new userModel();