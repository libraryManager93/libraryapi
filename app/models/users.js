const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const userSchema= new schema({
    id:String,
    name:String,
    password:String
});

const user= mongoose.model('user',userSchema);
module.exports=user;