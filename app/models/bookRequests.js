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
    requestId:String,
    approvedFlag:String,
    updatedBy: [{
        type: schema.Types.ObjectId,
        ref : 'user'
    }]
},{timestamps: true} );


const user= mongoose.model('bookRequest',bookRequestsSchema);
module.exports=user;