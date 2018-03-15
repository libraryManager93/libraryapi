const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const userSchema= new schema({
    id:String,
    name:String,
    password:String,
    role:String},
    {timestamps: true} );

const user= mongoose.model('user',userSchema);
module.exports=user;