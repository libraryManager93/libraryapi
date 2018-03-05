const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const userSchema= new schema({
    id:String,
    name:String,
    password:String,
    maxBooks:Number,
    role:String,
    currentlyBorrowedBooks:[{
        type: schema.Types.ObjectId,
        ref : 'borrowedBook'
    }],
     previouslyBorrowedBooks:[{
        type: schema.Types.ObjectId,
        ref : 'borrowedBook'
    }],
     myBookRequests:[{
        type: schema.Types.ObjectId,
        ref : 'bookRequest'
    }]
},{timestamps: true} );

const user= mongoose.model('user',userSchema);
module.exports=user;