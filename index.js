const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('toys-cart-is running')
})

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
    // client.connect();
    const totalToyCarCollection = client.db('toyCars').collection('totalCarToys');

// table to search category name show only search data
    app.get('/allToySearchName/:text', async (req, res) => {
      const searchText = req.params.text;
      const result = await totalToyCarCollection.find({
        $or: [
          { toyName: searchText },
          { subCategory: searchText }
        ]
      }).toArray()
      res.send(result)
    })

    // create toy data at first
    app.post('/addToy', async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      const result = await totalToyCarCollection.insertOne(body);
      res.send(result)
    })

// all toy data get
    app.get('/allToy', async (req, res) => {
      const limit = 20;
      const result = await totalToyCarCollection.find({}).limit(limit).toArray();
      res.send(result);
    })
// home page 3 category tab get find one category data
    app.get('/allToy/:text', async (req, res) => {
      const category = req.params.text;
      if (category == "MiniTruck" || category == "MiniBus" || category == "MiniPoliceCar") {
        const result = (await totalToyCarCollection.find({ subCategory: req.params.text }).sort({ price: 1 }).toArray());
        return res.send(result)
      }
      const result = (await totalToyCarCollection.find({ subCategory: req.params.text }).sort({ price: 1 }).toArray());
      return res.send(result)

    })
// My toy table click view details and show single data
    app.get('/singleToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await totalToyCarCollection.findOne(filter);
      res.send(result)
    })
//user click view details and show single data
    app.get('/singleSubDetails/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await totalToyCarCollection.findOne(filter);
      res.send(result)
    })
// user email and ascending descending conditional data find
    app.get('/myToy', async (req, res) => {
      const type = req.query.type == "ascending";
      const value = req.query.value;
      let query = {};
      console.log(query)
      if (req.query.email) {
        query = { sellerEmail: req.query.email }
      }
      let sortObj = {};
      sortObj[value] = type ? 1 : -1;
      const result = await totalToyCarCollection.find(query).sort(sortObj).toArray();
      res.send(result)
    })
// Admin updated product data
    app.put('/myToyUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          photo: body.photo,
          toyName: body.toyName,
          sellerName: body.sellerName,
          sellerEmail: body.sellerEmail,
          subCategory: body.subCategory,
          price: body.price,
          rating: body.rating,
          quantity: body.quantity,
          details: body.details,
          date: body.date
        },
      };
      const result = await totalToyCarCollection.updateOne(filter, updateDoc);
      res.send(result)
    })
// Admin deleted any her data get id and send
    app.delete('/myToy/:id', async (req, res) => {
      const body = req.params.id;
      const filter = { _id: new ObjectId(body) };
      const result = await totalToyCarCollection.deleteOne(filter);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`toys cart is running: ${port}`)
})
