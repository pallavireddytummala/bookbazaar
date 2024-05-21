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
          bookImage: 'https://www.google.com/imgres?q=the%20great%20gatsby&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F7a%2FThe_Great_Gatsby_Cover_1925_Retouched.jpg&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FThe_Great_Gatsby&docid=CQKsQBfci-Y4eM&tbnid=2hTkBZS7B5GsOM&vet=12ahUKEwiS-o7bvZyGAxUIamwGHczcDEsQM3oECH0QAA..i&w=1129&h=1600&hcb=2&itg=1&ved=2ahUKEwiS-o7bvZyGAxUIamwGHczcDEsQM3oECH0QAA',
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
          bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FTo_Kill_a_Mockingbird&psig=AOvVaw3TY2a1IT878e3-0oTvpSSk&ust=1716303570020000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjvi5q_nIYDFQAAAAAdAAAAABAE',
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
          bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FHarry-Potter-Philosophers-Stone-Rowling%2Fdp%2F1408855658&psig=AOvVaw0nb_x4zPinvNE8o4rLfcFs&ust=1716303652968000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLi4jL-_nIYDFQAAAAAdAAAAABAE',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.co.uk%2F1984-George-Orwell-Eighty-Four-Paperback%2Fdp%2F605746222X&psig=AOvVaw1VEckeO9G6oSyJDqi0TUCV&ust=1716303701529000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJiEwtm_nIYDFQAAAAAdAAAAABAJ',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.kobo.com%2Fin%2Fen%2Febook%2Fpride-and-prejudice-71&psig=AOvVaw219mw1oaegozklQgC5gEOl&ust=1716303741609000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPiQrem_nIYDFQAAAAAdAAAAABAE',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FCatcher-Rye-J-D-Salinger%2Fdp%2F0316769487&psig=AOvVaw02iVgqVackhRA-6x-_YK_h&ust=1716303773514000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMiG3_e_nIYDFQAAAAAdAAAAABAE',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FHobbit-There-Back-Again%2Fdp%2F0547844972&psig=AOvVaw0nurzt05ehkEf0dZty41K0&ust=1716303801139000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNiqxoTAnIYDFQAAAAAdAAAAABAE',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FThe_Lord_of_the_Rings&psig=AOvVaw2N3cVHPxN6pa8ttMHG0K_x&ust=1716303835015000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLjpvpjAnIYDFQAAAAAdAAAAABAE',
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
            bookImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bookchor.com%2Fbook%2F9780552149518%2Fthe-da-vinci-code&psig=AOvVaw2gybOlRlZuyUK8RSk_Qk8Z&ust=1716303870176000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKDQn6bAnIYDFQAAAAAdAAAAABAE',
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
