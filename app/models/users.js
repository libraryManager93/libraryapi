const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const userSchema= new schema({
    id:String,
    name:String,
    password:String,
    maxBooks:Number,
    role:String,
    borrowedBooks:[{
        type: schema.Types.ObjectId,
        ref : 'book'
    }],
     bookRequests:[{
        type: schema.Types.ObjectId,
        ref : 'bookRequest'
    }]
});

const user= mongoose.model('user',userSchema);
module.exports=user;