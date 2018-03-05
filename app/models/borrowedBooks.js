const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const borrowedBooksSchema= new schema({
    userId: [{
        type: schema.Types.ObjectId,
        ref : 'user'
    }],
    bookId:[{
        type: schema.Types.ObjectId,
        ref : 'book'
    }],
    borrowedDate:{type: Date, default: Date.now},
    requestId:String,
    dueDate:{type: Date, default: () => Date.now() + 7*24*60*60*1000},//7 days as due date
    borrowType:String,
    returnedFlag:String,
    pastDue:String
},{timestamps: true} );

const user= mongoose.model('borrowedBook',borrowedBooksSchema);
module.exports=user;