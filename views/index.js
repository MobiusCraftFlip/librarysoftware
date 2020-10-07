function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createUserForm() {
    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("createUserForm")["username"].value
    var fname = document.getElementById("createUserForm")["fname"].value
    var lname = document.getElementById("createUserForm")["lname"].value
    console.log("creating user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("createUserFormMessage").innerHTML = `Created user with Username: ${username}`;
        }
    };

    xhttp.open("POST", "/api/createUser", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&fname=${fname}&&lname=${lname}`);
}

function giveBookForm() {
    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("giveBookForm")["username"].value
    var isbn = document.getElementById("giveBookForm")["isbn"].value
    console.log("giving book to user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("giveBookForm").innerHTML = `Created user with Username: ${username}`;
        }
    };

    xhttp.open("POST", "/api/giveBook", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&isbn=${isbn}`);
}

function removeBookForm() {

    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("removeBookForm")["username"].value
    var isbn = document.getElementById("removeBookForm")["isbn"].value
    console.log("removing book from user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("giveBookForm").innerHTML = `Created user with Username: ${username}`;
        }
    };

    xhttp.open("POST", "/api/removeBook", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&isbn=${isbn}`);
    
}

function getUserForm() {

    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("getUserForm")["username"].value
    console.log("Getting user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ) {

            const json = JSON.parse(this.responseText)

            if (json[0] == undefined) {
                return
            }
            document.getElementById("getUserFormMessageUsername").innerHTML = json[0].username;
            document.getElementById("getUserFormMessageFname").innerHTML = json[0].fname;
            document.getElementById("getUserFormMessageLname").innerHTML = json[0].lname;

            var books = document.getElementById("getUserFormMessageBooks")

            removeAllChildNodes(books)
            for (rbook in json[0].books) {
                const book = json[0].books[rbook]
                
                //  Book Container
                var container = document.createElement("div")
                    container.className = "container"
                    container.id = "book"
                
                // Name of book
                var nameLabel = document.createElement("p")
                    nameLabel.setAttribute("for","name")
                    nameLabel.innerHTML = "Book name:"
                
                container.appendChild(nameLabel)
                

                var nameText = document.createElement("p")
                    nameText.setAttribute("for","name")
                    nameText.innerHTML = book.name + "\n"

                container.appendChild(nameText)


                // Authors of book
                var authorLabel = document.createElement("p")
                    authorLabel.setAttribute("for","name")
                    authorLabel.innerHTML = "Authors:"
                
                container.appendChild(authorLabel)
                
                for (rauthor in json[0].books[rbook].authors) {
                    console.log(json[0].books[rbook].authors)

                    var author = json[0].books[rbook].authors[rauthor]
                    var authorText = document.createElement("p")
                        authorText.setAttribute("for","name")
                        authorText.innerHTML = author + "\n"
                    container.appendChild(authorText)
                }
                

                

                // ISBN_10
                var isbn10Label = document.createElement("p")
                    isbn10Label.setAttribute("for","name")
                    isbn10Label.innerHTML = "ISBN 10:"

                container.appendChild(isbn10Label)

                var isbn10Text = document.createElement("p")
                    isbn10Text.setAttribute("for","name")
                    isbn10Text.innerHTML = book.isbn_10 + "\n"
                
                container.appendChild(isbn10Text)

                // ISBN_10
                var isbn13Label = document.createElement("p")
                    isbn13Label.setAttribute("for","name")
                    isbn13Label.innerHTML = "ISBN 13:"

                container.appendChild(isbn13Label)

                var isbn13Text = document.createElement("p")
                    isbn13Text.setAttribute("for","name")
                    isbn13Text.innerHTML = book.isbn_13 + "\n"
                
                container.appendChild(isbn13Text)
                
                books.appendChild(container)
            }
        }
    };

    xhttp.open("POST", "/api/getUser", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}`);
    
}