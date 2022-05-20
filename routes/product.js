const router = require('express').Router();
const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

router.post('/',verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body)
    try {
        const savedProduct=await newProduct.save();
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }

})

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json('product is deleted')
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const qlimit=req.query.limit;
        const qcategory=req.query.category;
        let products=await Product.find();
        if(qcategory)
        products = await Product.find({categories:{$in:[qcategory]}});
        if(qlimit)
        products=await Product.find().sort({_id:-1}).limit(qlimit)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }

})


module.exports = router