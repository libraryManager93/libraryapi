const borrowedBook= require('../models/borrowedBooks')


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
  //To do Subract a count from books collection(if borrow type is direct) and add the userId to it; Add the borrowed book to user collection,
  //increase the max number by 1 in books collection.
  const newBook = new borrowedBook(req.body);
  const addedBook=await newBook.save();
  //Subract a count from  books collection 
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