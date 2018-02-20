const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const bookRequestsSchema= new schema({
    borrowerId: [{
        type: schema.Types.ObjectId,
        ref : 'user'
    }],
    bookId:[{
        type: schema.Types.ObjectId,
        ref : 'book'
    }],
    requestedDate:Date,
    requestId:String,
    requestDueDate:Date,
    approvedFlag:String
});

const user= mongoose.model('bookRequest',bookRequestsSchema);
module.exports=user;