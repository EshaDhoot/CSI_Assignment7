const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { verifyToken } = require('../middlewares/authenticate')

router.get('/get-all-products', async (req, res) => {
    try {
        let products = await Product.find();
        return res.status(200).json({
            message: "products fetched successfully",
            data: products,
            success: true,
            error: {}
        });
    } catch (error) {
        return res.status(400).json({
            message: "error fetching products",
            data: {},
            success: false,
            error: error.message
        });
    }
});

router.get('/get-product/:product_id', async (req, res) => {
    try {
        let { product_id } = req.params;
        let product = await Product.findOne({ _id: product_id });
        res.status(200).json({
            message: "successfully fetched a product",
            data: product,
            success: true,
            error: {}
        });
    } catch (error) {
        res.status(400).json({
            message: "error fetching a product",
            data: {},
            success: false,
            error: error.message
        });
    }
});

router.post("/add-product", verifyToken, async (req, res) => {
    try {
        let product = await Product.create(req.body);
        res.status(201).json({
            message: "successfully created a new product",
            data: product,
            success: true,
            error: {}
        });
    } catch (error) {
        res.status(400).json({
            data: {},
            success: false,
            message: "error creating a new product",
            error: error.message
        });
    }
});

router.patch("/update-product/:product_id", verifyToken, async (req, res) => {

    try {
        let { product_id } = req.params;

        let product = await Product.findByIdAndUpdate(product_id, req.body);

        res.status(201).json({
            success: true,
            data: product,
            message: "updated a product successfully",
            error: {},
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "unable to update product",
            data: {},
            error: error.message
        });
    }
});

router.delete("/delete-product/:product_id", verifyToken, async (req, res) => {

    try {
        let { product_id } = req.params;
        let product = await Product.findByIdAndDelete(product_id, req.body);

        res.status(201).json({
            success: true,
            data: product,
            message: "deleted a product successfully",
            error: {},
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "unable to delete product",
            data: {},
            error: error.message
        });
    }
})

module.exports = router;