const book= require('../models/books')


module.exports = {
getAllBooks : async (req,res,next)=>{

const books= await book.find({});
console.log('---------Getting Books------------');
 res.status(200).json({
                        success: true,
                        message: 'books Fetched successfully',
                        result: books
                     })
},
addBooks : async (req,res,next)=>{
  console.log('---------Adding Books------------');
  const newBook = new book(req.body);
  const addedBook=await newBook.save();
  res.status(200).json({success: true,
                        message: 'books added successfully',
                        result:addedBook});
},
editBooks : async (req,res,next)=>{
      const books=await book.findOneAndUpdate({id:req.query.id}, req.body, {new: true});
    res.status(200).json({success: true,
                        message: 'Book edited successfully',
                        result:books});
},
deleteBooks : async (req,res,next)=>{
  const books=await book.findOneAndRemove({id:req.query.id});
    res.status(200).json({success: true,
                        message: 'Book Deleted successfully',
                        result:books});
}
}