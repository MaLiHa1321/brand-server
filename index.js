const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntnzcww.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     // Connect to the "insertDB" database and access its "haiku" collection
     const database = client.db("brands");
     const brandCollection = database.collection("brand");
     const phonesCollection = database.collection("phones");
     const cartCollection = database.collection("carts");



//  create brand
app.post('/brands', async(req,res) =>{
  const newBrand = req.body;
  console.log(newBrand)
  const result = await brandCollection.insertOne(newBrand);
  res.send(result)

})

app.get('/brands', async(req,res) =>{
  const cursor = brandCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/brands/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await brandCollection.findOne(query)
  res.send(result)
})

// create phone
app.post('/phones', async(req,res) =>{

  const newPhone = req.body;
  console.log(newPhone)
 
  const result = await phonesCollection.insertOne(newPhone);
  res.send(result)
})
// get phones data
app.get('/phones', async(req,res) =>{
  const cursor = phonesCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

// get id update
app.get('/phones/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await phonesCollection.findOne(query)
  res.send(result)
})
app.put('/phones/:id', async(req,res) =>{
  const id = req.params.id;
  const filter = { _id: new ObjectId(id)}
  const options = {upsert: true}
  const updateproduct = req.body;
  const product ={
    $set: {
      name : updateproduct.name,
     brand : updateproduct.brand,
      photo : updateproduct.photo,
      type : updateproduct.type,
      des : updateproduct.des,
      price : updateproduct.price,
      rating : updateproduct.rating
    
    }
  }
  const result = await phonesCollection.updateOne(filter,product,options)
  res.send(result)
})

// create cart item
app.post('/cart', async(req,res) =>{
  const cartItem = req.body;
  console.log(cartItem)
  const result = await cartCollection.insertOne(cartItem);
  res.send(result)

})
// get cart date
app.get('/cart', async(req,res) =>{
  const cursor = cartCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})
// delete cart item
app.delete('/cart/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result= await cartCollection.deleteOne(query)
  res.send(result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})