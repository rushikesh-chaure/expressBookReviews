const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let userexists = users.filter((user) => {
    return user.username === username;
  });
  return (userexists.length > 0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let userexists = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  return (userexists.length > 0)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "username and password both required" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password },'access', { expiresIn: 60 * 60 });
    req.session.authorization ={ accessToken, username }
    return res.status(200).json({ message: "User Logged in" });
  }
  return res.status(208).json({ message: "Invalid Login" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  if(books.hasOwnProperty(isbn)){
    if(!Array.isArray(books[isbn].reviews)){
      books[isbn].reviews = [];
    }
    books[isbn].reviews.push({ "username": req.session.authorization.username, "review": req.query.review });
    return res.status(300).json({ message: "Review Added!" });
  }else{
    return res.json({ message: "Book NOT found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
