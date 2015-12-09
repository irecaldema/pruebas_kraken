'use strict';

var mongoose = require('mongoose');

//var userModel = function () {
    
    //pendiente de retocar
    var userSchema = new mongoose.Schema({
        usuario: String,
        pass: String,
        email: String,
        activacion_key: String,
        verificado: Boolean
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
        if(this.verificado==1){
            return 'esta validado';
        }else{
            return 'no esta validado';
        }
    };
    
/*pruebas
     userSchema.methods.find({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.    
    return mongoose.model('userModel', userSchema);

})
    }*/ 
    //return mongoose.model('Usuario', userSchema);
//};

//module.exports = new userModel();

module.exports = mongoose.model('Usuario', userSchema);

//en proceso
//http://stackoverflow.com/questions/14307953/mongoose-typeerror-on-a-models-findone-method
//http://mongoosejs.com/docs/guide.html
//https://github.com/lmarkus/Kraken_Example_Shopping_Cart/blob/8ff3100bb06f9051270767432e3b51be4b9ee83f/README.md
//http://mongoosejs.com/docs/api.html#model_Model.find

//http://stackoverflow.com/questions/24172405/typeerror-object-has-no-method-find-when-using-mongoose-with-express
//module.exports = mongoose.model('userModel', userSchema)