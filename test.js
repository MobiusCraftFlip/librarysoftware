
require('dotenv').config(); // DOTENV
var MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true });
var dbo;

var fetch = require("node-fetch");

MongoClient.connect(process.env.mongodburi, (err, db) => {
    if (err)
        throw err;
    dbo = db.db("ddlibrary");
    console.log("connected to database");

    const isbn = 1405524081
    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
    
    .then(function (res) { return res.json(); })
    .then(function (json) {
        
        if (json.items[0].id != "t5rgAAAAMAAJ") {
            var isbn_13 = json.items[0].volumeInfo.industryIdentifiers[1].identifier;
            var isbn_10 = json.items[0].volumeInfo.industryIdentifiers[0].identifier;
            var name = json.items[0].volumeInfo.title;
            var authors = json.items[0].volumeInfo.authors;
            var id = json.items[0].id

            

            var bookBody = {};

            bookBody.name = name
            bookBody.authors = authors
            bookBody.isbn_10 = isbn_10
            bookBody.isbn_13 = isbn_13
            bookBody._id = id

            let query = dbo.collection("users").find(
                {
                    books: {
                        "$in": bookBody
                    }
                }
            )
            

            console.log(query)
        } else {
            return res.status(400).send(`-_- only numbers`);
        }
    }
)}) 
