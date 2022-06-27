const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express();
const cors = require('cors');
const { json } = require('express');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())





const uri = "mongodb+srv://outhshad-digital-media:RbYQZE55c4R9LLQ3@cluster0.vz35n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productsCollection = client.db("products").collection("foods");
        const categoryCollection = client.db("categories").collection("category");

        app.get('/AllProducts', async (req, res) => {
            const allProducts = await productsCollection.find().toArray();
            res.send(allProducts)
        })

        app.get('/category',async(req,res)=>{
            const category = await categoryCollection.find().toArray();
            res.send(category)
        })

        app.post('/createFood', async (req, res) => {
            const foodDetail = req.body;
            console.log('fodDetail', foodDetail)
            const result = await productsCollection.insertOne(foodDetail);
            res.send(result)
        })

        app.post('/createCategory',async(req,res)=>{
            const categoryDetail = req.body;
            console.log(categoryDetail);
            const result = await categoryCollection.insertOne(categoryDetail);
            res.send(result);
        })

        app.put('/updateProduct/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const productDetail = req.body; 
           
            const options = { upsert: true };
            const updateDoc = {
              $set: {
               name: productDetail.name,
               price: productDetail.price,
               category: productDetail.category,
              },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result) 
        })

        app.delete('/deleteProduct/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })

        app.delete('/deleteCategory',async(req,res)=>{
            const category = req.body.deleteCategory;
            const query = {category: category};
            const productQuery = {category: category};
            const result = await categoryCollection.deleteOne(query);
            const productResult = await productsCollection.deleteMany(productQuery);
            res.send(result)
        })
        app.delete('/categoryProduct',async(req,res)=>{
            const category = req.body.deleteCategory;
            const query = {category: category};
            const productResult = await productsCollection.deleteMany(query);
            res.send(productResult)
        })

        app.get('/', (req, res) => {
            res.send('Hello World from Outshade-digital-media!')
        })
    }
    finally { }
}

run().catch(console.dir())


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})