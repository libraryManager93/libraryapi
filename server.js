//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var path = require('path');//to get the folders path
var apiRoutes = express.Router();// get an instance of the router for api routes
const util = require('util');
Object.assign=require('object-assign')+

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'assets'))); //to support sending image urls
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.set('superSecret','ABCDEFGHIJKLMNOPQ'); // secret variable


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
    //console.log('Middleware Body----'+util.inspect(req.body));
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

//Connection parms setting

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL||'mongodb://localhost:27017/library',
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

console.log('mongoUrl--'+mongoURL);
//Initializing DB connecitons
var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb').MongoClient;
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};
//Public API Starts here---------------------------------------------------------------------
app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.get('/getAllBooks', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('books').find().toArray((err, books ) => {
      if (err) console.log(err);
        //console.log('user----'+util.inspect(user));
      //If no users are present 
      if (isEmpty(books)) {
      res.json({ success: true, message: 'No books to Dislplay.' });
    }else if (books) {
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'books Fetched successfully',
          result: books
        });
      }  
    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  }
});
//Login token is generated here---------------------------------------------------------------------
app.post('/authenticate', (req, res) => {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    console.log('querying+++++'+JSON.stringify(req.body));
    db.collection('user').find({id:req.body.id}).toArray((err, user ) => {
      if (err) throw err;
        console.log('user----'+util.inspect(user));
      if (isEmpty(user)) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }else if (user) {

      // check if password matches
      if (user[0].password != req.body.password) {
        console.log(user[0].password+'--Matching Pwds--'+req.body.password)
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: user.admin,
      name: user.name,
    id:user.id
    };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn : 60*60*24 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }  
      } 

    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  }
});
//Public API Ends here---------------------------------------------------------------------

//Private API starts here---------------------------------------------------------------------

//User Related APIs

apiRoutes.post('/addUser', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
 if (db) {
    console.log('querying+++++'+JSON.stringify(req.body));
    db.collection('user').insertOne(req.body, function(err, out )  {
      if (err)
      { 
        console.log(err);

        if(err.code== 11000){
                         res.json({
          success: false,
          message: 'This User is already present'
        });
        }
else{
                   res.json({
          success: false,
          message: 'User Insertion failed'
        });
}

}
else{
        console.log('Out value after insertion'+out.insertedCount);
   if (out.insertedCount==1) {
        res.json({
          success: true,
          message: 'User Inserted successfully'
        });
      }
      else{
         res.json({
          success: false,
          message: 'User Insertion failed'
        });
      }
}
  
       

    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  }
});

apiRoutes.get('/users', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
 if (db) {
    console.log('querying+++++'+JSON.stringify(req.body));
    db.collection('user').find().toArray((err, user ) => {
      if (err) console.log(err);
        //console.log('user----'+util.inspect(user));
      //If no users are present 
      if (isEmpty(user)) {
      res.json({ success: true, message: 'No Users to Dislplay.' });
    }else if (user) {
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Users Fetched successfully',
          result: user
        });
      }  
       

    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  }
});

apiRoutes.post('/editUser', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
  //  console.log('user----'+util.inspect(req.body));
    db.collection('user').updateOne({id:req.body.id},req.body,function(err, result ){
    if (err) console.log(err);
    
    if(result.ok=='1'){
      res.json({ success: true});
    }
    else{
      res.json({ success: false});
    }
    });
  } else {
    res.json({ success: false,message:"Unable to connect to Database" });
  }
});

apiRoutes.post('/deleteUser', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    console.log('user----'+util.inspect(req.body));
    db.collection('user').deleteOne({id:req.body.id},function(err, result ){
    if (err) throw err;
    
    if(result.deletedCount > 0){
      res.json({ success: true});
    }
    else{
    //  console.log(result);
      res.json({ success: false});
    }
    });
  } else {
    res.json({ success: false,message:"Unable to connect to Database" });
  }
});

// Borrowed books and borrowbook request api The major business functionalities
apiRoutes.get('/getBorrowedBooks', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    console.log('querying+++++'+JSON.stringify(req.body));
    db.collection('borrowedBooks').find().toArray((err, out ) => {
      if (err) console.log(err);
        //console.log('user----'+util.inspect(user));
      //If no users are present 
      if (isEmpty(out)) {
      res.json({ success: true, message: 'No books to Dislplay.' });
    }else if (out) {
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'borrowedBooks Fetched successfully',
          result: out
        });
      }  
       

    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  } 
});

apiRoutes.get('/bookRequests', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

apiRoutes.get('/requestBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }});

apiRoutes.get('/lendBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

apiRoutes.get('/returnBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

//New book add/delete/edit related api
apiRoutes.post('/addBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
 if (db) {
    console.log('INserting book+++++'+JSON.stringify(req.body));
    db.collection('books').insertOne(req.body, function(err, out )  {
      if (err)
      { 
        console.log(err);

        if(err.code== 11000){
                         res.json({
          success: false,
          message: 'This Book is already present'
        });
        }
else{
                   res.json({
          success: false,
          message: 'Book Insertion failed'
        });
}

}
else{
        console.log('Out value after insertion'+out.insertedCount);
   if (out.insertedCount==1) {
        res.json({
          success: true,
          message: 'Book Inserted successfully'
        });
      }
      else{
         res.json({
          success: false,
          message: 'Book Insertion failed'
        });
      }
}
  
    });
  } else {
    res.json({success: false,message: 'Error Connecting DB'});
  }
});

apiRoutes.get('/editBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});
apiRoutes.get('/deleteBook', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});
//Private API ends here---------------------------------------------------------------------

//Generic functions--------------------------------------
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;