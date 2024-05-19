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

        // Set collections in the app
        app.set('usersCollection', usersCollection);
        app.set('sellersCollection', sellersCollection);
        app.set('deliverysCollection', deliverysCollection);
        app.set('adminsCollection', adminsCollection);
        app.set('booksCollection', booksCollection);
        app.set('ordersCollection', ordersCollection);
        app.set('cartsCollection', cartsCollection);
        app.set('deliveredCollection', deliveredCollection);

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
          bookImage: 'https://example.com/book1.jpg',
          username: 'seller',
          status: true,
          count:"10",
          comments: []
        },
        {
          bookId:"2",
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          category: 'Classic Literature',
          price: 12.99,
          bookImage: 'https://example.com/book2.jpg',
          username: 'seller',
          status: true,
          count:"10",
          comments: []
        },
        {
          bookId:"3",
          title: "Harry Potter and the Philosopher's Stone",
          author: 'J.K. Rowling',
          category: 'Fantasy',
          price: 15.99,
          bookImage: 'https://example.com/book3.jpg',
          username: 'seller',
          status: true,
          count:10,
          comments: []
        },
        {
          bookId:"4",
            title: '1984',
            author: 'George Orwell',
            category: 'Dystopian Fiction',
            price: 9.99,
            bookImage: 'https://example.com/book4.jpg',
            username: 'seller',
            status: true,
            count:10,
            comments: []
          },
          {
            bookId:"5",
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            category: 'Romance',
            price: 11.99,
            bookImage: 'https://example.com/book5.jpg',
            username: 'seller',
            status: true,
            count:10,
            comments: []
          },
          {
            bookId:"6",
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            category: 'Coming-of-Age Fiction',
            price: 10.49,
            bookImage: 'https://example.com/book6.jpg',
            username: 'seller',
            status: true,
            count:10,
            comments: []
          },
          {
            bookId:"7",
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            category: 'Fantasy',
            price: 14.99,
            bookImage: 'https://example.com/book7.jpg',
            username: 'seller',
            status: true,
            count:10,
            comments: []
          },
          {
            bookId:"8",
            title: 'The Lord of the Rings',
            author: 'J.R.R. Tolkien',
            category: 'Fantasy',
            price: 19.99,
            bookImage: 'https://example.com/book8.jpg',
            username: 'seller',
            status: true,
            count:10,
            comments: []
          },
          {
            bookId:"9",
            title: 'The Da Vinci Code',
            author: 'Dan Brown',
            category: 'Mystery',
            price: 13.49,
            bookImage: 'https://example.com/book9.jpg',
            username: 'seller',
            status: true,
            count:10,
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
