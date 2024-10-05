const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registred successfully" });

    }
    else {
      return res.status(400).json({ message: "username NOT valid" });
    }
  }
  return res.status(300).json({ message: "username and password required" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res)=> {
  //Write your code here
  try {
    const books = await require("./booksdb.js");
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Somthing went wrong",error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let isbnPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    }, 3000)
  });

  isbnPromise.then(()=>{
    if(books.hasOwnProperty(isbn)){
      let data = books[isbn]
      if (data) {
        return res.status(200).json(data);
      }
    }
    return res.status(300).json({ message: "Book NOT found" });
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const data = Object.values(books).filter(value => value.author === author);

  if (!data[0]){
    return res.status(300).json({ message: "Author NOT found" });
  }
  return res.status(200).json({ data });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const data = Object.values(books).filter(value => value.title === title);

  if (!data){
    return res.status(300).json({ message: "Book NOT found" });
  }
  return res.status(200).json({ data });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    return res.status(200).json(
      { 
        Title: books[isbn].title, 
        reviews: books[isbn].reviews 
      }
    );
  }
  return res.status(300).json({ message: "Book NOT found" });
});

module.exports.general = public_users;
