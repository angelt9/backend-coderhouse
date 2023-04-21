import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager('productos.json');
const productRouter = Router();

productRouter.get('/', async(req, res) => {
    const limit = parseInt(req.query.limit);

    const products = await productManager.getProducts();

    if(!limit) return res.send(products);

    res.send(products.slice(0,limit));
});

productRouter.get('/:pid', async(req, res) => {
    const pid = parseInt(req.params.pid);

    const result = await productManager.getProductById(pid);

    res.status(result.code).send((result.code !== 200)? result : result.product)
});

productRouter.post('/', async(req, res) => {
    let {title, description, price, thumbnail, code, stock, category, status} = req.body;
    status = status ?? true;
    thumbnail = thumbnail ?? "Sin imagen";
    
    const result = await productManager.addProduct({title, description, price, thumbnail, code, stock, category, status});

    res.status(result.code).send(result);
});

productRouter.put('/:pid', async(req, res) => {
    const pid = parseInt(req.params.pid);
    const {title, description, price, thumbnail, code, stock, category, status} = req.body;

    const result = await productManager.updateProduct(pid, {title, description, price, thumbnail, code, stock, category, status});

    res.status(result.code).send(result);
});

productRouter.delete('/:pid', async(req, res) => {
    const pid = parseInt(req.params.pid);

    const result = await productManager.deleteProduct(pid);

    res.status(result.code).send(result);
})

export default productRouter;