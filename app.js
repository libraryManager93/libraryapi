const express= require ('express');
const logger = require ('morgan');
const app= express();
const mongoose= require ('mongoose');
var bodyParser = require('body-parser');
//routes
const publicApi= require('./app/routes/public/publicApi');
const validateToken = require('./app/controllers/validateToken');
//to be deleted
app.set('env','dev');
app.set('superSecret','ABCDEFGHIJKLMNOPQ'); // secret variable
//Connection parms setting

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL||'mongodb://localhost:27017/library',
    mongoURLLabel = "";


//Connecting to db

mongoose.connect(mongoURL, (err,next)=>{
    if(err){
        console.log('mongoose error',err);
    }
    next();
});

//middlewares
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(logger('dev'));

//--Checking if the req has token



//routes
app.use(publicApi);
//app.use(validateToken.validateToken,publicApi);

app.get('/',(req,res)=>{
res.status(200).json({
    message:'Everything will be ok :)'
})
});

//catching 404 errors
app.use((req,res,next) =>{
const err= new Error('Page Not Found');
err.status=404;
next(err);
});

//error handling functions

app.use((err,req,res,next)=>{

const error= app.get('env')==='dev'?err : {};
const status = err.status || 500;
console.log(error.message);
res.status(status).json({
    error:{
        message : error.message
    }
});

});

//starting the server

app.listen(port
,()=>{
console.log('Application is listening in',port,ip);
})