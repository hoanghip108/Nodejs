var express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
var mongodb = require('mongodb');
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
        res.render('home')
    })
    //duong dan den database
var url = 'mongodb+srv://hoanghip1008:Hoanghandsome1@cluster0.uruxgmw.mongodb.net/test'
    // var url = 'mongodb://localhost:27017'
    //import thu vien MongoDB
var MongoClient = require('mongodb').MongoClient;

app.post('/search', async(req, res) => {
    let nameSearch = req.body.txtName
    let client = await MongoClient.connect(url);
    let dbo = client.db("asm");
    let product = await dbo.collection("product").find({ $or: [{ 'name': new RegExp(nameSearch, 'i') }, { _id: nameSearch }] }).toArray()
    res.render('allProduct', { 'product': product })
})

app.get('/viewAll', async(req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("asm");
    let product = await dbo.collection("product").find().toArray()
    res.render('allProduct', { 'product': product })
})

app.get('/create', (req, res) => {
    res.render('createProduct')
})
app.post('/createProduct', async(req, res) => {

    let name = req.body.txtName
    let price = req.body.txtPrice
    let picURL = req.body.txtPicture
    let Sale = req.body.sale
    if (name.length < 5) {
        res.render('createProduct', { 'nameError': 'Name must have more than 5 characters' })
        return
    }
    // else if (!(Number.isInteger(price))) {
    //     res.render('createProduct', { 'priceError': 'Price must be a number' })
    //     return
    // }
    let product = {
        'name': name,
        'price': price,
        'picURL': picURL,
        'sale': Sale
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("asm");
    await dbo.collection("product").insertOne(product);
    res.redirect('/viewAll')
})


const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")