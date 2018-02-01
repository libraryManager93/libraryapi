const express= require ('express');
const logger = require ('morgan');
const app= express();

//routes
const publicApi= require('./app/routes/public/publicApi');

//to be deleted
app.set('env','dev');
//Connection parms setting

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL||'mongodb://localhost:27017/library',
    mongoURLLabel = "";

//middlewares

app.use(logger('dev'));


//routes
app.use(publicApi);

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

app.listen(port,()=>{
console.log('Application is listening in',port,ip);
})