// In user-api.js
const express = require('express');
const adminRouter = express.Router();
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const verifyToken=require('../Middlewares/verifyToken');
let adminsCollection;
let deliverysCollection;
let ordersCollection;
// Define routes
adminRouter.use((req, res,next) => {
  // Handle GET request for users
  adminsCollection = req.app.get('adminsCollection');
  deliverysCollection=req.app.get('deliverysCollection');
  ordersCollection=req.app.get('ordersCollection');
  next();
})
//see all admin
adminRouter.get('/users', (req, res) => {
  // Handle GET request for users

  
});
adminRouter.post('/login', async (req, res) => {
  const credObj = req.body;
  let dbAdmin = await adminsCollection.findOne({ username: credObj.username });

  if (dbAdmin === null) {
    res.send({ message: "Invalid username" });
  } else {
    // Here, you would compare passwords directly
    let result=await bcryptjs.compare(credObj.password,dbAdmin.password)
    if(result==false) res.send({message:"Invalid password"})
    else {
      // Create token and send it as a response
      let signedToken = jwt.sign({ username: dbAdmin.username }, 'abcdef', { expiresIn: 120 });
      delete dbAdmin.password;
      // Send token and admin details as response
      res.send({ message: "login success", token: signedToken, admin: dbAdmin });
    }
  }
});
//register new admin
adminRouter.post('/register',async(req,res)=>{
  let newAdmin=req.body;
  //check for duplicate user
  let dbAdmin=await adminsCollection.findOne({username:newAdmin.username});
  if(dbAdmin!=null){
      return res.send({message:"Admin already exist"})
  }
  let hashedPassword=await bcryptjs.hash(newAdmin.password,6)
  newAdmin.password=hashedPassword;
  await adminsCollection.insertOne(newAdmin)
  res.send({message:"Admin created"})
})
//register new delivery person
adminRouter.post('/delivery/register', async (req, res) => {
  try {
    let newDel = req.body;

    // Check for duplicate user
    let dbDel = await deliverysCollection.findOne({ username: newDel.username });
    if (dbDel != null) {
      return res.send({ message: "Delivery already exists" });
    }

    // Hash the password
    let hashedPassword = await bcryptjs.hash(newDel.password, 6);
    newDel.password = hashedPassword;

    // Insert the new delivery person
    await deliverysCollection.insertOne(newDel);

    res.send({ message: "Delivery created" });
  } catch (error) {
    console.error("Error registering delivery:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
//see all orders
adminRouter.get('/orders',async(req,res)=>{
  let orderslist=await ordersCollection.find().toArray();
    res.send(orderslist)

})
//add delivery person to the order
adminRouter.put('/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log(orderId);
    const deliveryPersonId = req.body.delId;

    // Update the order with the delivery person ID
    const updatedOrder = await ordersCollection.findOneAndUpdate(
      { orderId: orderId },
      { $set: { deliveryPerson: deliveryPersonId } },
      { returnDocument: 'after' } // Get the updated document
    );

    // Check if the order was found and updated
    if (updatedOrder) {
      res.send(updatedOrder);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//see all delivery persons
adminRouter.get('/deliveryPersons',async (req, res) => {
  try {
    const deliveryPersons = await deliverysCollection.find().toArray();
    console.log(deliveryPersons)
    res.send(deliveryPersons);
  } catch (error) {
    console.error("Error fetching delivery persons:", error);
    res.status(500).send({ message: "Internal server error" });
  }
})
// Export the router
module.exports = adminRouter;
