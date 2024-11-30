const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect With MongoDB.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk6aw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect()

    const database = client.db('EspressoCoffee').collection('products')

    //Get data from the Database to Server.
    app.get('/coffees', async (req, res) => {
      const cursor = database.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    // Get data by ID from the Database.
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await database.findOne(query)
      res.send(result)
    })

    //Send data to the Database.
    app.post('/coffees', async (req, res) => {
      const coffee = req.body
      console.log(coffee)
      const result = await database.insertOne(coffee)
      res.send(result)
    })

    const userDatabase = client.db('EspressoCoffee').collection('users')

    // Send Login User data to the Database.
    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await userDatabase.insertOne(user)
      res.send(result)
    })

    // Get Login User data from the Database.
    app.get('/users', async (req, res) => {
      const cursor = userDatabase.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    // Get Login User data by ID from the Database.
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userDatabase.findOne(query)
      res.send(result)
    })

    // Delete data from the Database.
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await database.deleteOne(query)
      res.send(result)
    })

    //Delete Login User data from the Database.
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userDatabase.deleteOne(query)
      res.send(result)
    })

    // Update data in the Database.
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const updateCoffee = {
        $set: {
          name: req.body.name,
          chef: req.body.chef,
          supplier: req.body.supplier,
          taste: req.body.taste,
          category: req.body.category,
          details: req.body.details,
          photo: req.body.photo
        }
      }
      const result = await database.updateOne(query, updateCoffee)
      res.send(result)
    })

    // Update Login User data in the Database.
    app.patch('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const updateUser = {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        }
      }
      const result = await userDatabase.updateOne(query, updateUser)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Expresso Coffee is Running!')
})

app.listen(port, () => {
  console.log(`Expresso Coffee Server is running on port ${port}`)
})
