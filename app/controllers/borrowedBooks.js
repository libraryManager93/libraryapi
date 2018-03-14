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
  console.log(addedBook._id);

  //increase the max number by 1 in user collection. Add the borrowed book to user collection
  try{
 console.log('Trying',req.query.userId);
const increaseBookCountInUser= await user.findOneAndUpdate({id:req.query.userId},
{$push: { "currentlyBorrowedBooks": addedBook._id }}, {new: true});
  }
  catch(err){
    console.log('Errorrrrr'+err);
  }
/*
  //Subract a count from  books collection and added borrower id to it
  if(req.query.bookId && req.query.type==="direct"){
   const reduceBookInBooks= await book.findOneAndUpdate({cover_edition_key:req.query.bookId},
   {$push: { 'currentBorrowerIds': increaseBookCountInUser._id }}, { $inc: {book_count_i : -1}}, {new: true});
}

else{
 const addBorwInBooks= await book.findOneAndUpdate({cover_edition_key:req.query.bookId},
   {$push: { 'currentBorrowerIds': increaseBookCountInUser._id }}, {new: true});

}
*/
  res.status(200).json({success: true,
                        message: 'Added to borrowed book list successfully',
                        result:addedBook});
},
//It will change the request to returned
editborrowedBooks : async (req,res,next)=>{
      const books=await borrowedBook.findByIdAndUpdate(req.query.id, req.body, {new: true});
      //Add a count to  books collection
      //reduce a count from user collection max book
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