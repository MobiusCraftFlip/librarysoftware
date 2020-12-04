//require('dotenv').config(); // DOTENV
// REQUIRES
var express = require("express");
var bodyParser = require('body-parser');
var fetch = require("node-fetch");
//  DATABASE
const uri = ""
var MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var dbo;
MongoClient.connect(uri, function (err, db) {
    if (err)
        throw err;
    dbo = db.db("ddlibrary");
    console.log("connected to database");
});


var app = express();

app.use(express.urlencoded());
app.use(express.static("views"))

app.post("/api/createUser", async function (req, res) {

    var obj = {
        username: req.body.username.toLowerCase(),
        fname: req.body.fname.toLowerCase(),
        lname: req.body.lname.toLowerCase(),
        books: []
    };
    dbo.collection("users").find({username: { $eq: req.body.username}}).toArray(function(err, result) {
        if (result[0] == undefined) {
            dbo.collection("users").insertOne(obj, function (err1, mres) {
                if (err1) {
                    throw err; 
                    return res.status(500).send();
                }
                console.log("inserted user: " + req.body.username);
                res.status(200).send();
            });
        } else {
            res.status(400).send("Duplicate users not allowed")
        }
    })
});

app.post("/api/giveBook", function (req, res) {
    /*if (req.body.name == undefined || req.body.isbn == undefined) {
        return res.status(400).send()
    }*/

    const isbn = req.body.isbn
    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
    
        .then(function (res) { return res.json(); })
        .then(function (json) {
            if (json.items == undefined) { 
                return res.status(500).send()
            }
            if (json.items[0] == undefined) { 
                return res.status(500).send()
            }
            if (json.items[0].id != "t5rgAAAAMAAJ") {
                var isbn_13 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_13").identifier;
                var isbn_10 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_10").identifier;
                var name = json.items[0].volumeInfo.title;
                var authors = json.items[0].volumeInfo.authors;
                var id = json.items[0].id

                var username = {
                    username: req.body.username.toLowerCase()
                };

                var push = {};

                push["$push"] = { books: { } }

                push["$push"].books.name = name
                push["$push"].books.authors = authors
                push["$push"].books.isbn_10 = isbn_10
                push["$push"].books.isbn_13 = isbn_13
                push["$push"].books._id = id

                dbo.collection("users").updateOne({ username: { $eq: req.body.username.toLowerCase() } }, push, {multi: false})

                res.status(200).send()
            } else {
                return res.status(400).send(`-_- only numbers`);
            }
        }
        
    ); 
});

app.post(`/api/removeBook`, (req,res) => {
    /*if (req.body.name == undefined || req.body.isbn == undefined) {
        return res.status(400).send()
    }*/
    const isbn = req.body.isbn
    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
        .then(function (res) { return res.json(); })
        .then(function (json) {
            if (json.items == undefined) { 
                return res.status(500).send()
            }
            if (json.items[0] == undefined) { 
                return res.status(500).send()
            }
            console.log(json.items[0].volumeInfo.industryIdentifiers)

            var isbn_13 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_13").identifier;
            var isbn_10 = json.items[0].volumeInfo.industryIdentifiers.find(element => element.type == "ISBN_10").identifier;
            var name = json.items[0].volumeInfo.title;
            var authors = json.items[0].volumeInfo.authors;
            var username = {
                username: req.body.username.toLowerCase()
            };

            var book = {};

            book.name = name
            book.authors = authors
            book.isbn_10 = isbn_10
            book.isbn_13 = isbn_13

            dbo.collection("users").updateOne(
                { 
                    username: { $eq: req.body.username.toLowerCase() }
                },
                {
                    $pull: {books: {$in: [book]}}
                }
            )
            res.status(200).send()
        }
    )
})

app.post("/api/getUser", (req, res) => {
    dbo.collection("users").find({username: req.body.username.toLowerCase()}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
  })
  
})

app.post("/api/deleteUser", (req,res) => {
    dbo.collection("users").deleteOne({
        "username": req.body.username.toLowerCase()
        
    }).then((z) => {
        console.log(z)
    }).catch(err => {
        res.status(500).send()
        throw(err)
    })
    res.send("test")
})

app.post("/api/getUserWithBook", (req,res) => {
    const isbn = req.body.isbn
    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)

    .then(function (res) { return res.json(); })
    .then(function (json) {
        if (json.items == undefined) { 
            return res.status(500).send()
        }
        if (json.items[0] == undefined) { 
            return res.status(500).send()
        }
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
                    res.status(200).send(result)
                })
        } else {
            return res.status(400).send(`-_- only numbers`);
        }
    })
    
})

app.listen(3000);