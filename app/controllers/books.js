const book= require('../models/books')


module.exports = {
getAllBooks : async (req,res,next)=>{

const books= await book.find({});
console.log('---------------------');
 res.status(200).json({
             success: true,
          message: 'books Fetched successfully',
          result: books
            })
}
}