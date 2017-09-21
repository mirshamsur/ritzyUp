// Include Server Dependencies
var bodyParser = require("body-parser");
var cookieParser = require ("cookie-parser");
var express = require("express");
var favicon =require ("serve-favicon");
var fileUpload = require ("express-fileupload");
var localStrategy = require ("passport-local").Strategy
var logger = require("morgan");
var mongoose = require("mongoose");
var path =  require ("path");
var passport = require ("passport");
var webpack = require ("webpack");


var expressionSession = require ("expression-session")({

	secret: 'random-strings here',
	resave: false, 
	saveUninitialized: false,
});


// Require babel-register

require ("babel-register");

var flash = require ("connect-flash");
var session = require("expression-session");

//Require History Schemas
var User = require("./models/user");
var PostAdd = require("./models/PostAdd");

//Routes

var authentication = require ("./routes/api/authentication");

// Create Instance of Express
var app = express();

// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

app.use (fileUpload());

app.post("/upload", function(res, req){
if(!req.files){
	res.send("No file uploaded");
}else{

	var file = req.files.file;
	var extension = path.extname(filename);
	if(extension ! == "png" && extension ! ==".gif" && extension ! ==".jpg"){
		res.send ("only images are allowed");
	}else{

		file.mv (_dirname+"/uploads/" +file.name, function(err){
			if(err){
				res.status(500).send(err);

			}else{

				res.send("File Uploaded");
			}
		});
	}

}

})

//View engine setup

app.set ("views", path.join(_dirname,"views"));
app.set ("view engine", "ejs");

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use (cookieParser());
app.use (require("expression-session")({
	secret:'any random string can go here',

	resave:false,
	saveUninitialized:false
}));
//////////////////////////////////////////////

app.use(express.static("./public"));

// MongoDB Configuration configuration (Change this URL to your own DB)

mongoose.connect("mongodb://localhost/reactdb"); 
 
var db = mongoose.connection;

//Show any mongoose error

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});


//  Once logged in to the db through mongoose, log a successful message

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//initialize api routes
app.use("/api", require("./routes/apiRoutes"));
// Main "/" Route. This will redirect the user to our rendered React application
app.use("/", require("./routes/viewRoutes"));

// Listener
app.listen(PORT, function() {
  console.log("App listening  on PORT: " + PORT);
});
