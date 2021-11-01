const express = require('express');
const { MongoClient } =require('mongodb')
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express();
const port=process.env.PORT ||5000;


app.use(cors());
app.use(express.json());

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkh6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const packageCollection = client.db("Packages");
      const services = packageCollection.collection("services");
      const ordersCollection = packageCollection.collection('orders');
      const ordersFormCollection = packageCollection.collection('newOrders');
   //get API 
   app.get("/services",async (req, res)=>{

      const cursor=services.find({});
      const service =await cursor.toArray();
      res.send(service);



   })   

      

//post API
app.post('/services',async(req, res) => {
   const service= req.body;
      
const result=await services.insertOne(service);
res.json(result);
})

//get my Orders
app.get('/myOrders/:email',async (req, res) => {
  const result=await ordersCollection.find({email:req.params.email}).toArray();
res.send(result);


})
//get my Orders
app.get('/allOrders',async (req, res) => {
  const result=await ordersCollection.find({}).toArray();
res.send(result);


})
//add order to database
app.post('/addOrders',(req, res) => {
  ordersCollection.insertOne(req.body).then((result) => {
    console.log(result);
    res.send(result);
  })


})
//Delete api
app.delete('/deleteOrders/:id',async (req, res) => {

 const result=await ordersCollection.deleteOne({_id:(req.params.id)});
 console.log(result);
 res.send(result);
})


app.post('/addOrdersForm',(req, res) => {
  ordersFormCollection.insertOne(req.body).then((result) => {
    res.send(result);
  })


})





    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req, res) => {
    res.send('running server')
})


app.listen(port,()=>{
    console.log('listening on port',port);
})