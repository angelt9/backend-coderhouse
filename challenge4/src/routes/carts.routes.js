import { Router } from "express";
import CartManager from "../CartManager.js";

const cartManager = new CartManager("carrito.json");
const cartRouter = Router();

cartRouter.post('/', async(req, res) => {
    const result = await cartManager.createEmptyCart();
    res.status(result.code).send(result);
});

cartRouter.get('/:cid', async(req, res) => {
    const cid = parseInt(req.params.cid);

    const result = await cartManager.getCartById(cid);

    res.status(result.code).send((result.code !== 200)? result : result.cart)
});

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const result = await cartManager.addProductToCart(cid, pid);

    res.status(result.code).send(result);
});

export default cartRouter;