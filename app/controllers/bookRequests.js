const bookRequest= require('../models/bookRequests')


module.exports = {
getBookRequests : async (req,res,next)=>{

const books= await book.find({});
console.log('---------Getting Books------------');
 res.status(200).json({
                        success: true,
                        message: 'books Fetched successfully',
                        result: books
                     })
},
addBookRequests : async (req,res,next)=>{
  console.log('---------Adding Books------------');//Just create req with pending status
  const newBook = new book(req.body);
  const addedBook=await newBook.save();
  res.status(200).json({success: true,
                        message: 'Request added successfully',
                        result:addedBook});
},
editBookRequests : async (req,res,next)=>{//approve or reject the request ; if approved reduce the book count to one
      const books=await book.findOneAndUpdate({id:req.query.id}, req.body, {new: true});
    res.status(200).json({success: true,
                        message: 'Request edited successfully',
                        result:books});
},
deleteBookRequests : async (req,res,next)=>{
  const books=await book.findOneAndRemove({id:req.query.id});
    res.status(200).json({success: true,
                        message: 'Request Deleted successfully',
                        result:books});
}
}