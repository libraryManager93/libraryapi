const bookRequest= require('../models/bookRequests')
const book= require('../models/books')


module.exports = {
getBookRequests : async (req,res,next)=>{

const books= await bookRequest.find({}).populate({ path: 'borrowerId', select: '-password' })
                                        .populate('bookId')
                                        .populate({ path: 'updatedBy', select: '-password' });
console.log('---------Getting Books------------');
 res.status(200).json({
                        success: true,
                        message: 'books Fetched successfully',
                        result: books
                     })
},
addBookRequests : async (req,res,next)=>{
  console.log('---------Adding Books------------');//Just create req with pending status
  const newBook = new bookRequest(req.body);
  const addedBook=await newBook.save();
  res.status(200).json({success: true,
                        message: 'Request added successfully',
                        result:addedBook});
},
editBookRequests : async (req,res,next)=>{//approve or reject the request ;
  
  if(req.body && req.body.approvedFlag=="true"){
      const books=await bookRequest.findOneAndUpdate({requestId:req.query.id}, req.body, {new: true});
// if approved reduce the book count to one
      const onApproval= await book.findOneAndUpdate({cover_edition_key:req.query.bookId}, { $inc: {book_count_i : -1}}, {new: true});
      res.status(200).json({success: true,
                        message: 'Request Approved successfully',
                        result:books});
  }
  else{
    //Request rejected
    const books=await bookRequest.findOneAndUpdate({requestId:req.query.id}, req.body, {new: true});
      res.status(200).json({success: true,
                        message: 'Request rejected successfully',
                        result:books});
  }
    
},
deleteBookRequests : async (req,res,next)=>{
  const books=await bookRequest.findOneAndRemove({id:req.query.id});
    res.status(200).json({success: true,
                        message: 'Request Deleted successfully',
                        result:books});
}
}