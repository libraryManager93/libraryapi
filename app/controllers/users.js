const user= require('../models/users')
const jwt    = require('jsonwebtoken');
const express= require ('express');
const app= express();
app.set('superSecret','ABCDEFGHIJKLMNOPQ'); // secret variable

module.exports = {
authenticateUser : async (req,res,next)=>{
const users=await user.find({id:req.body.id});
console.log(req.body.id);
if (isEmpty(users)) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }else if (users) {

      // check if password matches
      if (users[0].password != req.body.password) {
        console.log(users[0].password+'--Matching Pwds--'+req.body.password)
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: users.admin,
      name: users.name,
    id:users.id
    };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn : 60*60*24 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
}
},

getUsers : async(req,res,next)=>{
    const users=await user.find({}).select('-password');
    res.status(200).json({success: true,
                        message: 'users Fetched successfully',
                        result:users});
},
editUsers : async(req,res,next)=>{
    const users=await user.findOneAndUpdate({id:req.query.id}, req.body, {new: true}).select('-password');
    res.status(200).json({success: true,
                        message: 'User edited successfully',
                        result:users});
},
addUsers : async(req,res,next)=>{
    const users=await user.find({});
    const newUser = new user(req.body);
    const addedUser=await newUser.save().select('-password');
  res.status(200).json({success: true,
                        message: 'User added successfully',
                        result:addedUser});
},
deleteUsers : async(req,res,next)=>{
const users=await user.findOneAndRemove({id:req.query.id}).select('-password');
    res.status(200).json({success: true,
                        message: 'User Deleted successfully',
                        result:users});
}

}


//Generic functions--------------------------------------
 function isEmpty  (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
