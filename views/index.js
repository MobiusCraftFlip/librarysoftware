function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

var deleteUserUsername

let cooldown = 2000
let lastClick = 0
function createUserForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();

    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("createUserForm")["username"].value
    var fname = document.getElementById("createUserForm")["fname"].value
    var lname = document.getElementById("createUserForm")["lname"].value
    console.log("creating user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("createUserFormMessage").innerHTML = `Created user with Username: ${username}`;
        } else if (this.readyState == 4 && this.status == 400) {
            document.getElementById("createUserFormMessage").innerHTML = `Duplicate users not allowed`;
        }
    };

    xhttp.open("POST", "/api/createUser", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&fname=${fname}&&lname=${lname}`);
}

function giveBookForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();
    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("giveBookForm")["username"].value
    var isbn = document.getElementById("giveBookForm")["isbn"].value
    console.log("giving book to user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("giveBookFormMessage").innerHTML = `Given book to user: ${username} ISBN: ${isbn}`;
        } else if (this.readyState == 4 && this.status == 400) {
            document.getElementById("giveBookFormMessage").innerHTML = `-_- ONLY NUMBERS U FOOL`;
        } else if (this.readyState == 4 && this.status == 500) {
            document.getElementById("giveBookFormMessage").innerHTML = "An error has Occured"
        } 
    };

    xhttp.open("POST", "/api/giveBook", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&isbn=${isbn}`);
}

function removeBookForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();

    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("removeBookForm")["username"].value
    var isbn = document.getElementById("removeBookForm")["isbn"].value
    console.log("removing book from user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("removeBookFormMessage").innerHTML = `Given book to ${username} with isbn: ${isbn}`;
        } else if (this.status == 400) {
            document.getElementById("removeBookFormMessage").innerHTML = `-_- only numbers`;
        } else if (this.readyState == 4 && this.status == 500) {
            document.getElementById("removeBookFormMessage").innerHTML = "An error has Occured"
        } 
    };

    xhttp.open("POST", "/api/removeBook", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}&&isbn=${isbn}`);
    
}

function getUserForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();
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

function delteUserForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();
    var xhttp = new XMLHttpRequest();

    var username = document.getElementById("delteUserForm")["username"].value
    console.log("removing user part 1")
    xhttp.onreadystatechange = function() {

        
        if (this.readyState == 4 && this.status == 200) {

            const json = JSON.parse(this.responseText)

            if (json[0] == undefined) {
                return
            }
            const username = json[0].username;
            deleteUserUsername = username
            const fname = json[0].fname;
            const lname = json[0].lname;
            const numberOfBooksOut = json[0].books.length

            document.getElementById("delteUserFormOutput").className = `container`;
            document.getElementById("delteUserFormOutputAreYouSure").innerHTML = `Are you sure you want to delete user with name: ${fname} ${lname} and username: ${username}. That user has ${numberOfBooksOut} books out`;
        } else if (this.readyState == 4 && this.status == 400) {
            throw new error()
        }
    };

    xhttp.open("POST", "/api/getUser", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${username}`);
}

function deleteUserNo() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();
    var deleteUserUsername = null
    document.getElementById("delteUserFormOutput").className = `ghost`;
}
function deleteUserSure() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();
    
    var xhttp = new XMLHttpRequest();

    console.log("deleting user")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("delteUserFormMessage").innerHTML = `Deleted user with username: ${deleteUserUsername}`;
        } else if (this.readyState == 4) {
            throw new error()
            document.getElementById("delteUserFormMessage").innerHTML = `An error occured http code ${this.status}`;
        }
    };

    xhttp.open("POST", "/api/deleteUser", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`username=${deleteUserUsername}`);
    
}

function GetusersWithBookForm() {
    if (lastClick >= (Date.now() - cooldown)) {
        return;
    }
    lastClick = Date.now();

    var isbn = document.getElementById("GetusersWithBookFormIsbn").value
    
    var xhttp = new XMLHttpRequest();

    console.log("GetingUsersWithBook")
    xhttp.onreadystatechange = function() {

        
        if (this.readyState == 4 && this.status == 200) {
            
            var json = JSON.parse(this.responseText)
            var message = document.getElementById("GetusersWithBookFormMessage")
            removeAllChildNodes(message)
            json.forEach(element => {
                var usercontainer = document.createElement("div")
                    usercontainer.className = "container"
                    usercontainer.id = "book"
                    message.appendChild(usercontainer)
                
                // Name of book
                var userNameLabel = document.createElement("p")
                    userNameLabel.setAttribute("for","name")
                    userNameLabel.innerHTML = "UserName:"
                
                usercontainer.appendChild(userNameLabel)
                

                var userNameText = document.createElement("p")
                    userNameText.setAttribute("for","name")
                    userNameText.innerHTML = element.username + "\n"
                
                usercontainer.appendChild(userNameText)

                // Name of book
                var fNameLabel = document.createElement("p")
                    fNameLabel.setAttribute("for","name")
                    fNameLabel.innerHTML = "First Name:"
                
                usercontainer.appendChild(fNameLabel)
                

                var fNameText = document.createElement("p")
                    fNameText.setAttribute("for","name")
                    fNameText.innerHTML = element.fname + "\n"
                
                usercontainer.appendChild(fNameText)

                var lNameLabel = document.createElement("p")
                    lNameLabel.setAttribute("for","name")
                    lNameLabel.innerHTML = "Last Name:"
                
                usercontainer.appendChild(lNameLabel)
                

                var lNameText = document.createElement("p")
                    lNameText.setAttribute("for","name")
                    lNameText.innerHTML = element.lname + "\n"
                
                usercontainer.appendChild(lNameText)

                
                for (rbook in element.books) {
                    const book = element.books[rbook]
                    
                    //  Book Container
                    var container = document.createElement("div")
                        container.className = "container"
                        container.id = "book"
                        usercontainer.appendChild(container)
                    
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
                }
            })
            
        } else if (this.readyState == 4 && this.status == 500) {
            document.getElementById("GetusersWithBookFormMessage").innerHTML = `An error occured http code ${this.status}`;
        }
    };

    xhttp.open("POST", "/api/getUserWithBook", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(`isbn=${isbn}`);
}

            