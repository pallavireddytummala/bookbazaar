// In user-api.js
const express = require('express');
const delApp = express.Router();
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
let deliverysCollection;
let ordersCollection;
let deliveredCollection;
delApp.use((req, res,next) => {
  deliverysCollection=req.app.get('deliverysCollection');
  ordersCollection=req.app.get('ordersCollection');
  deliveredCollection=req.app.get('deliveredCollection');
  next();
})
delApp.post('/login', async (req, res) => {
  const credObj = req.body;
  let dbUser = await deliverysCollection.findOne({ username: credObj.username });
  console.log(dbUser)
  if (dbUser == null) {
    res.send({ message: "Invalid username" });
  } else {
    let result = await bcryptjs.compare(credObj.password, dbUser.password);
    if (result == false) res.send({ message: "Invalid password" });
    //create token send token as response
    else {
      let signedToken = jwt.sign({ username: dbUser.username }, 'abcdef', { expiresIn: 120 });
      delete dbUser.password;
      //send token as res
      res.send({ message: "login success", token: signedToken, delivery: dbUser });
    }
  }
});

// Define routes
delApp.get('/delivery/:delId', async (req, res) => {
  const delId = req.params.delId;

  try {
    const deliveries = await ordersCollection.find(
      { deliveryPerson: delId }
    ).toArray();
    console.log(deliveries);

    if (deliveries.length === 0) {
      res.send('No deliveries found for this delivery person' );
      return;
    }

    console.log(deliveries);
    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).send('Error fetching deliveries');
  }
});
// PUT route to update order status in delivery collection and move to delivered collection
delApp.post('/delivery/:orderId', async (req, res) => {
  let orderObj = req.body;
    let orderId = req.params.orderId;
    //console.log(orderId)
    
    try {
        let delObj = await ordersCollection.findOne({ orderId: orderId });
        
        if (!delObj) {
            return res.status(404).send({ message: "User's cart is empty or not found" });
        }

        let d=await deliveredCollection.insertOne(orderObj);
        await ordersCollection.deleteOne({ orderId: orderId });

        res.send({ message: "Order delivered", payload: orderObj });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});


//after delivery update delivered
delApp.put('/delivery/:orderId',async(req,res)=>{
  const orderId=req.params.orderId;
  const updatedOrder=await ordersCollection.findOneAndUpdate({orderId:orderId},{$set:{orderstatus:false}},{returnDocument:"after"});
  res.send({message:"order status updated",payload:updatedOrder})
})
// Export the router
module.exports = delApp;
