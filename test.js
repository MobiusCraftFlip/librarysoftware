var fetch = require("node-fetch");


fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + 9780547249643)
    
        .then(function (res) { return res.json(); })
        .then(function (json) {
            console.log(json.items[1])
            if (json.items[0] != undefined) {
                console.log(json.items[0].volumeInfo.industryIdentifiers);
                var isbn_13 = json.items[0].volumeInfo.industryIdentifiers[1].identifier;
                var isbn_10 = json.items[0].volumeInfo.industryIdentifiers[0].identifier;
                var name = json.items[0].volumeInfo.title;
                var authors = json.items[0].volumeInfo.authors;
               
            }
        }
    )