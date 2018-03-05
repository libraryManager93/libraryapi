const mongoose= require ('mongoose');
const schema = mongoose.Schema;

const bookSchema= new schema({

         title_suggest: String,
         title:String,
         cover_edition_key:String,
         book_count_i:Number,
         book_count_t:Number,
          currentBorrowerIds: [{
        type: schema.Types.ObjectId,
        ref : 'user'
    }],
          oldBorrowerIds: [{
        type: schema.Types.ObjectId,
        ref : 'user'
    }],
         author_name:[  
            {type : schema.Types.String}
         ],
         contributor:[  
            {type : schema.Types.String}
         ],
         publisher:[  
            {type : schema.Types.String}
         ],
         first_sentence:[  
            {type : schema.Types.String}
         ],
         language:[  
         {type : schema.Types.String}
         ],
         subject:[  
        {type : schema.Types.String}
         ],
         image_url:String
},{timestamps: true} 
);

const books= mongoose.model('book',bookSchema);
module.exports=books;