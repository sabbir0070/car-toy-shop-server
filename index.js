const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
res.send('toys-cart-is running')
})

// OjWDhXtRlAis7o8d


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjpgufh.mongodb.net/?retryWrites=true&w=majority`;

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
const totalToyCarCollection = client.db('toyCars').collection('totalCarToys');
// search system all toys
const indexkeys = { toyName: 1, subCategory: 1 };
const indexOptions = { name: "toyNameSubCategory"}

const result = await totalToyCarCollection.createIndex(indexkeys,indexOptions);
app.get('/allToySearchName/:text', async(req,res)=>{
const searchText = req.params.text;
const result = await  totalToyCarCollection.find({
$or: [
{toyName:{$regex:searchText, $options:'i'} },
{subCategory:{$regex:searchText, $options:'i'} }
]
}).toArray()
res.send(result)
})


app.post('/addToy', async(req, res)=>{
const body = req.body;
console.log(body);
console.log(body)
const result = await totalToyCarCollection.insertOne(body);
res.send(result)
})


app.get('/allToy', async(req, res)=>{
const result = await totalToyCarCollection.find({}).toArray();
res.send(result);
})

app.get('/singleToy/:id', async(req, res)=>{
const id = req.params.id;
const filter = {_id: new ObjectId(id)};
const result = await totalToyCarCollection.findOne(filter);
res.send(result)
})

app.get('/myToy/:email', async(req, res)=>{
console.log(req.params.email)
const result = await totalToyCarCollection.find({sellerEmail:req.params.email}).toArray();
res.send(result)
})

app.delete('/myToy/:id', async(req, res)=>{
const body = req.params.id;
const filter = {_id: new ObjectId(body)};
const result = await totalToyCarCollection.deleteOne(filter);
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



app.listen(port,()=>{
console.log(`toys cart is running: ${port}`)
})
