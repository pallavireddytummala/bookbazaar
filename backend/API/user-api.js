const exp = require('express');
const userApp=exp.Router();
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const verifyToken=require('../Middlewares/verifyToken');

let usersCollection;
let cartsCollection;
let booksCollection;
let ordersCollection;
userApp.use((req,res,next)=>{
    usersCollection=req.app.get('usersCollection');
    cartsCollection=req.app.get('cartsCollection');
    booksCollection=req.app.get('booksCollection');
    ordersCollection=req.app.get('ordersCollection');
    next();
})
//register new user
userApp.post('/register',async(req,res)=>{
    let newUser=req.body;
    //check for duplicate user
    let dbUser=await usersCollection.findOne({username:newUser.username});
    if(dbUser!=null){
        return res.send({message:"User already exist"})
    }
    let hashedPassword=await bcryptjs.hash(newUser.password,6)
    newUser.password=hashedPassword;
    await usersCollection.insertOne(newUser)
    res.send({message:"User created"})
})
//login user
userApp.post('/login',async(req,res)=>{
    const credObj=req.body;
    let dbUser= await usersCollection.findOne({username:credObj.username})
    if(dbUser==null){
        res.send({message:"Invalid username"})
    }else{
        let result=await bcryptjs.compare(credObj.password,dbUser.password)
        if(result==false) res.send({message:"Invalid password"})
        //create token send token as response
        else{
            let signedToken=jwt.sign({username:dbUser.username},'abcdef',{expiresIn:120})
            delete dbUser.password;
            //send token as res
            res.send({message:"login success",token:signedToken,user:dbUser})
        }
    }
})

//see books
userApp.get('/books',async(req,res) => {
    let booksList=await booksCollection.find({status:true}).toArray();
    res.send(booksList)
})
//add review to book
userApp.put('/book/:bookId/comment',async(req,res)=>{
    let commentObj=req.body;
    let bookUrlId=req.params.bookId;
    let bookWithComment=await booksCollection.findOneAndUpdate({bookId:bookUrlId},{$addToSet:{comments:commentObj}},{retunDocument:"after"});
    res.send({message:"comment added",payload:bookWithComment})
})
//add books to cart
userApp.put('/user/:username/:bookId', async (req, res) => {
    try {
        let userUrlId=req.params.username;
        let bookUrlId=req.params.bookId;
        const bookObj = await booksCollection.findOne(
            { bookId:bookUrlId },
            { },
            { returnDocument: "after" } // upsert: true creates a new document if it doesn't exist
        );
        if (!bookObj) {
            return res.status(404).send({ message: "Book not found" });
        }
        
        let cartObj = await cartsCollection.findOneAndUpdate(
            { username: userUrlId },
            { $addToSet: { books: bookObj } },
            { returnDocument: "after", upsert: true } // upsert: true creates a new document if it doesn't exist
        );
        res.send({ message: "Book added to cart", payload: cartObj });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
//view cart
userApp.get('/user/:username/cart', async (req, res) => {
    try {
      const username = req.params.username;
      const cartObj = await cartsCollection.findOne({ username: username });
      if (!cartObj || !cartObj.books || cartObj.books.length === 0) {
        res.status(404).send('Cart not found or empty');
        console.log('Cart not found or empty')
      } else {
        res.send(cartObj.books);
        console.log("hi",cartObj.books);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

//delete book from cart
userApp.delete('/user/:username/:bookId',async(req,res)=>{
  let bookUrlId=req.params.bookId;
  let username=req.params.username;
  let bookObj=await cartsCollection.findOneAndUpdate({username:username},{$pull:{books:{bookId:bookUrlId}}},{retunDocument:"after"});
  res.send({message:"book removed from cart",payload:bookObj})
})
//add order
userApp.post('/orders/:username', async (req, res) => {
    let orderObj = req.body;
    let username = req.params.username;
    
    try {
        let cartObj = await cartsCollection.findOne({ username: username });
        
        if (!cartObj || !cartObj.books) {
            return res.status(404).send({ message: "User's cart is empty or not found" });
        }

        orderObj.deliveryPerson = "";
        orderObj.orderstatus = true;
        orderObj.books = cartObj.books;
        orderObj.username = username;
        

        await ordersCollection.insertOne(orderObj);
        await cartsCollection.deleteOne({ username: username });

        res.send({ message: "Order placed", payload: orderObj });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});


module.exports=userApp;
