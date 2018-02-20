module.exports = {
validateToken : async (req,res,next)=>{
    try{
    console.log('validating...');
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const jwt    = require('jsonwebtoken');
  const express= require ('express');
  const app= express();
  app.set('superSecret','ABCDEFGHIJKLMNOPQ'); // secret variable
  // decode token
  if (token) {
    console.log('Has token');
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
    //console.log('Middleware Body----'+util.inspect(req.body));
        next();
      }
    });

  } else {
console.log('no token');
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
    }
    catch(err){
        console.log('errrrr',err);
    }
}

}