const exp = require('express');
const app = exp();
const { MongoClient,ServerApiVersion } = require('mongodb');
const userApp = require('./API/user-api');
const adminApp = require('./API/admin-api');
const sellerApp = require('./API/seller-api');
const deliveryApp = require('./API/delivery-api');
const path = require('path');
const cors = require('cors');
const bcryptjs=require('bcryptjs');
const mongoose = require('mongoose');
app.use(cors());
app.use(exp.json());
app.use(exp.static(path.join(__dirname, '../frontend/build')));

const port = 4000;
const dbUrl = 'mongodb+srv://Pallu:Pallu@bookstore.33gwdzv.mongodb.net/?retryWrites=true&w=majority&appName=BookStore'

// Connect to MongoDB and create collections
const client = new MongoClient(dbUrl,{
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

mongoose.connect(dbUrl)
    .then(() => {
        const db = client.db();

        // Define collections
        const usersCollection = db.collection('user');
        const sellersCollection = db.collection('seller');
        const deliverysCollection = db.collection('delivery');
        const adminsCollection = db.collection('admin');
        const booksCollection = db.collection('books');
        const ordersCollection = db.collection('orders');
        const cartsCollection = db.collection('cart');
        const deliveredCollection = db.collection('delivered');
        const paymentsCollection = db.collection('payment');

        // Set collections in the app
        app.set('usersCollection', usersCollection);
        app.set('sellersCollection', sellersCollection);
        app.set('deliverysCollection', deliverysCollection);
        app.set('adminsCollection', adminsCollection);
        app.set('booksCollection', booksCollection);
        app.set('ordersCollection', ordersCollection);
        app.set('cartsCollection', cartsCollection);
        app.set('deliveredCollection', deliveredCollection);
        app.set('paymentsCollection', paymentsCollection);

        console.log("DB connection successful");
        let newAdmin = { role: 'admin', username: 'admin', password: 'admin' };
        let newSeller = { role: 'seller', username: 'seller', password:'seller'};
        let newUser= { role:'user', username: 'user', password:'user' };
// Hash the password
bcryptjs.hash(newAdmin.password, 6)
    .then((hashedPassword) => {
        newAdmin.password = hashedPassword;
        // Insert admin credentials into adminsCollection
        return adminsCollection.insertOne(newAdmin);
    })
    .then(() => console.log("Admin credentials inserted successfully"))
    .catch(err => console.error("Error inserting admin credentials:", err));
    bcryptjs.hash(newSeller.password, 6)
    .then((hashedPassword) => {
        newSeller.password = hashedPassword;
        // Insert admin credentials into adminsCollection
        return sellersCollection.insertOne(newSeller);
    })
    .then(() => console.log("Seller credentials inserted successfully"))
    .catch(err => console.error("Error inserting admin credentials:", err));
    bcryptjs.hash(newUser.password, 6)
    .then((hashedPassword) => {
        newUser.password = hashedPassword;
        // Insert admin credentials into adminsCollection
        return usersCollection.insertOne(newUser);
    })
    .then(() => console.log("User credentials inserted successfully"))
    .catch(err => console.error("Error inserting admin credentials:", err));
    const sampleBooks = [
        {
        bookId
        :"1",
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          category: 'Classic Literature',
          price: 10.99,
          bookImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
          username: 'seller',
          status: true,
          comments: []
        },
        {
          bookId:"2",
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          category: 'Classic Literature',
          price: 12.99,
          bookImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/800px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
          username: 'seller',
          status: true,
          comments: []
        },
        {
          bookId:"3",
          title: "Harry Potter and the Philosopher's Stone",
          author: 'J.K. Rowling',
          category: 'Fantasy',
          price: 15.99,
          bookImage: 'https://m.media-amazon.com/images/I/81q77Q39nEL._SL1500_.jpg',
          username: 'seller',
          status: true,
          comments: []
        },
        {
          bookId:"4",
            title: '1984',
            author: 'George Orwell',
            category: 'Dystopian Fiction',
            price: 9.99,
            bookImage: 'https://m.media-amazon.com/images/I/61NAx5pd6XL._SY466_.jpg',
            username: 'seller',
            status: true,
            comments: []
          },
          {
            bookId:"5",
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            category: 'Romance',
            price: 11.99,
            bookImage: 'https://cdn.kobo.com/book-images/afcd8653-3b27-4423-bee9-570fb1441aed/353/569/90/False/pride-and-prejudice-71.jpg',
            username: 'seller',
            status: true,
            comments: []
          },
          {
            bookId:"6",
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            category: 'Coming-of-Age Fiction',
            price: 10.49,
            bookImage: 'https://m.media-amazon.com/images/I/51TI+w56qFL._SY445_SX342_.jpg',
            username: 'seller',
            status: true,
            comments: []
          },
          {
            bookId:"7",
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            category: 'Fantasy',
            price: 14.99,
            bookImage: 'https://m.media-amazon.com/images/I/717TGeIkVML._SY425_.jpg',
            username: 'seller',
            status: true,
            comments: []
          },
          {
            bookId:"8",
            title: 'The Lord of the Rings',
            author: 'J.R.R. Tolkien',
            category: 'Fantasy',
            price: 19.99,
            bookImage: 'https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif',
            username: 'seller',
            status: true,
            comments: []
          },
          {
            bookId:"9",
            title: 'The Da Vinci Code',
            author: 'Dan Brown',
            category: 'Mystery',
            price: 13.49,
            bookImage: 'https://img.bookchor.com/images/cover/568/9780552149518.jpg',
            username: 'seller',
            status: true,
            comments: []
          }
      ];
      
      // Insert sample books into the booksCollection
      booksCollection.insertMany(sampleBooks)
        .then(() => {
          console.log("Sample books added successfully");
        })
        .catch(error => {
          console.error("Error adding sample books:", error);
        });
    

        // Start the server after connecting to the database
        app.listen(port, () => console.log(`http server listening on ${port}`));

        // Routes
        app.use('/admin-api', adminApp);
        app.use('/user-api', userApp);
        app.use('/seller-api', sellerApp);
        app.use('/delivery-api', deliveryApp);
    })
    .catch(err => console.error("Error in DB connection: ", err));
    
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: "Internal server error", payload: err.message });
});
