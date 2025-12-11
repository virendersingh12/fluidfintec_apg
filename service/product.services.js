const Product = require('../models/products');

module.exports ={addProducts,addProducts1, productList}

async function addProducts(req){
    try {
        const {receipt_data, transactionId} = req.body;
        console.log(receipt_data)
        const receipt =JSON.parse(receipt_data);
        console.log(receipt)
        for(let i= 0; i< receipt.length;i++){
            let {name, quantity, totalAmount} = receipt[i];
            const data ={ name, quantity, totalAmount, transactionId};
            await Product.create(data);
        }
        return await Product.find({transactionId});
    } catch (error) {
        throw error;
    }
}

async function addProducts1(req){
    try {
        const {receipt_data, transactionId} = req.body;
        console.log(receipt_data)
        const receipt =JSON.parse(receipt_data);
        console.log(receipt)
        for(let i= 0; i< receipt.length;i++){
            let {name, quantity, totalAmount, taxFinals} = receipt[i];
            // taxFinals = JSON.parse(taxFinals)
            const data ={ name, quantity, totalAmount, transactionId, taxFinals};
            console.log(data, "add data")
            const products = await Product.create(data);
            console.log(products, "addProducts")
        }
        return await Product.find({transactionId});
    } catch (error) {
        throw error;
    }
}

async function productList(req){
    try {
        const {transactionId} = req.body;
        return await Product.find(transactionId)    
    } catch (error) {
        throw error;
    }
    
}