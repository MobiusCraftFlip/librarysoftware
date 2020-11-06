
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

    const isbn = 9780765375650
    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
    
    .then(function (res) { return res.json(); })
    .then(function (json) {
        
        if (json.items[0].id != "t5rgAAAAMAAJ") {
            var isbn_13 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_13").identifier;
            var isbn_10 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_10").identifier;
            var name = json.items[0].volumeInfo.title;
            var authors = json.items[0].volumeInfo.authors;
            var id = json.items[0].id
            

            

            var bookBody = {};

            bookBody.name = name
            bookBody.authors = authors
            bookBody.isbn_10 = isbn_10
            bookBody.isbn_13 = isbn_13
            bookBody._id = id
            console.log(bookBody)

            let query = dbo.collection("users").find({
                books: {
                    "$in":[
                        bookBody
                    ]
                }
            })
                .toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                })
        } else {
            return res.status(400).send(`-_- only numbers`);
        }
    }
)}) 
