const borrowedBook= require('../models/borrowedBooks')
const user= require('../models/users')
const book= require('../models/books')


module.exports = {
getborrowedBooks : async (req,res,next)=>{

const books= await borrowedBook.find({}).populate({ path: 'userId', select: '-password' })
                                        .populate('bookId');
console.log('---------Getting Books------------');
 res.status(200).json({
                        success: true,
                        message: 'borrowedBooks Fetched successfully',
                        result: books
                     })
},
addborrowedBooks : async (req,res,next)=>{
  console.log('---------Adding Books------------');

//Added borrow request to borroweDbooks collection
  const newBook = new borrowedBook(req.body);
  const addedBook=await newBook.save();

  //increase the max number by 1 in user collection. Add the borrowed book to user collection
  
 console.log('Trying',req.query.userId);
// const increaseBookCountInUser= await user.findOneAndUpdate({id:req.query.userId},
// {$push: { "currentlyBorrowedBooks": [addedBook._id] }}, {new: true});
// console.log(req.query.bookId+'increaseBookCountInUser----req.query.bookId'+increaseBookCountInUser._id);


  //Subract a count from  books collection and added borrower id to it
  if(req.query.bookId && req.query.type==="direct"){
  //  await book.findOneAndUpdate({cover_edition_key:req.query.bookId},
  //  {$push: { 'currentBorrowerIds': [increaseBookCountInUser._id] }});
   const reduceBookInBooks= book.findOneAndUpdate({cover_edition_key:req.query.bookId}, { $inc: {book_count_i : -1}}, {new: true});
}

// else{
//  const addBorwInBooks= await book.findOneAndUpdate({cover_edition_key:req.query.bookId},
//    {$push: { 'currentBorrowerIds': [increaseBookCountInUser._id] }}, {new: true});

// }

  res.status(200).json({success: true,
                        message: 'Added to borrowed book list successfully',
                        result:addedBook});
},
//It will change the request to returned
editborrowedBooks : async (req,res,next)=>{
      const books=await borrowedBook.findOneAndUpdate({cover_edition_key:req.query.bookId}, {$set: { 'returned': 'true'}}, {new: true});
      //Add a count to  books collection
      const addBookInBooks= book.findOneAndUpdate({cover_edition_key:req.query.bookId}, { $inc: {book_count_i : 1}}, {new: true});
      //Modify books from user collection
    res.status(200).json({success: true,
                        message: 'borrowedBook edited successfully',
                        result:books});
},
deleteborrowedBooks : async (req,res,next)=>{
  const books=await borrowedBook.findByIdAndRemove(req.query.id);
    res.status(200).json({success: true,
                        message: 'borrowedBook Deleted successfully',
                        result:books});
}
}