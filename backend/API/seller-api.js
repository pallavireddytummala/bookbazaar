// In user-api.js
const exp = require('express');
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const verifyToken=require('../Middlewares/verifyToken');
const sellerApp = exp.Router();
let sellersCollection;
let booksCollection;
sellerApp.use((req, res,next) => {
  // Handle GET request for users
  sellersCollection = req.app.get('sellersCollection');
  booksCollection = req.app.get('booksCollection');
  next();
})
//register new seller
sellerApp.post('/register',async(req,res)=>{
  let newSeller=req.body;
    //check for duplicate user
    let dbSeller=await sellersCollection.findOne({username:newSeller.username});
    if(dbSeller!=null){
        return res.send({message:"Seller already exist"})
    }
    let hashedPassword=await bcryptjs.hash(newSeller.password,6)
    newSeller.password=hashedPassword;
    await sellersCollection.insertOne(newSeller)
    res.send({message:"Seller created"})
})
//login seller
sellerApp.post('/login',async(req,res)=>{
  const credObj=req.body;
  let dbSeller= await sellersCollection.findOne({username:credObj.username})
  if(dbSeller==null){
      res.send({message:"Invalid sellername"})
  }else{
      let result=await bcryptjs.compare(credObj.password,dbSeller.password)
      if(result==false) res.send({message:"Invalid password"})
      //create token send token as response
      else{
          let signedToken=jwt.sign({username:dbSeller.username},'abcdef',{expiresIn:120})
          delete dbSeller.password;
          //send token as res
          res.send({message:"login success",token:signedToken,seller:dbSeller})
      }
  }
});
//add new book by seller



// Define the endpoint for adding a book
sellerApp.post('/addbook', async (req, res) => {
  try {
    let newBook = req.body;
    await booksCollection.insertOne(newBook);
    res.send({ message: "Book added" });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//edit already book by seller
// sellerApp.put('/book', async (req, res) => {
//   let modifiedBook = req.body;
//   let id=modifiedBook.bookId;
//  // console.log(modifiedBook._id)
//   // Extract _id from the modified book and remove it from the update data
//   const {_id,  ...updateData } = modifiedBook;
//   //console.log(updateData);
//   let bookAfterModification = await booksCollection.findOneAndUpdate(
//     { bookId: id }, // Use _id to identify the document
//     { $set: { ...updateData } }, // Use $set operator to update fields
//     { returnDocument: "after" }
//   );
//   // let bookAfterModification = await booksCollection.findOneAndUpdate(
//   //   { _id: _id }, // Use _id to identify the document
//   //   { $set: { ...updateData } }, // Use $set operator to update fields
//   //   { returnDocument: "after" }
//   // );
//   // console.log("hi",bookAfterModification);
//   res.send(bookAfterModification );
// });
sellerApp.put('/books/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const modifiedBook = req.body;
    const { _id, ...updateData } = modifiedBook;

    // Use findOneAndUpdate to find the document by bookId and update it
    const bookAfterModification = await booksCollection.findOneAndUpdate(
      { bookId: bookId }, // Find the document by bookId
      { $set: { ...updateData } }, // Update the fields
      { returnDocument: "after" } // Return the updated document
    );

    // Send the updated book as the response
    res.json(bookAfterModification);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Internal Server Error');
  }
});

//delete 

sellerApp.put('/books/:username/:bookId',async(req,res)=>{
  let authorIdOfUrl=req.params.bookId; 
  let currentStatus=req.body.status;

  if(currentStatus==true){
      let restoredArtcile=await booksCollection.findOneAndUpdate({bookId:authorIdOfUrl},{$set:{status:currentStatus}},{returnDocument:"after"});
      res.send({message:"Book restored",payload:restoredArtcile})
  }
  if(currentStatus==false){
      let removedArtcile=await booksCollection.findOneAndUpdate({bookId:authorIdOfUrl},{$set:{status:currentStatus}},{returnDocument:"after"});
      res.send({message:"Book removed",payload:removedArtcile})
  }
});

//see books
sellerApp.get('/books/:username',async(req,res)=>{
  let sellerIdOfUrl=req.params.username;
  let books=await booksCollection.find({username:sellerIdOfUrl}).toArray();
  res.send(books)
});
sellerApp.get('/books/:_id', async (req, res) => {

    console.log("Book");
    let sellerIdOfUrl = req.params._id;
    console.log(sellerIdOfUrl);
    
    // Use findOne instead of find to retrieve a single document
    let book = await booksCollection.find({_id: sellerIdOfUrl });

    if (book) {
      console.log(book);
      res.send(book);
    } else {
      console.log("Book not found");
      res.status(404).send({ error: 'Book not found' });
    }
  
});
sellerApp.delete('/bookdelete/:bookId',async(req,res) => {
  let authorIdOfUrl=req.params.bookId;
  let removedArtcile=await booksCollection.findOneAndDelete({bookId:authorIdOfUrl});
  res.send({message:"Book removed",payload:removedArtcile})
})


// Export the router
module.exports = sellerApp;