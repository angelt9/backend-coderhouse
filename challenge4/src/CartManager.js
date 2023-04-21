import * as fs from "fs";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("productos.json");

class CartManager {
  constructor(path) {
    this.path = path;
    this.loadFile();
  }

  async createEmptyCart() {
    const itemsJSON = await fs.promises.readFile(this.path, "utf-8");
    const items = JSON.parse(itemsJSON);

    items.push({ id: this.idIncrement, products: [] });
    await fs.promises.writeFile(this.path, JSON.stringify(items));
    this.idIncrement++;
    return { code: 201, status: "Created", message: "Carrito creado" };
  }

  async getCartById(id) {
    const itemsJSON = await fs.promises.readFile(this.path, "utf-8");
    const items = JSON.parse(itemsJSON);

    if (items.some((cart) => cart.id === parseInt(id))) {
      return {
        code: 200,
        status: "Ok",
        cart: items.find((cart) => cart.id === parseInt(id)),
      };
    }
    return {
      code: 400,
      status: "Bad Request",
      message: "Carrito no encontrado",
    };
  }

  async addProductToCart(cid, pid) {
    const res = await productManager.getProductById(parseInt(pid));
    const product = res.product ?? false;
    if (!product) return res;
    if (product.stock === 0)
      return {
        code: 400,
        status: "Bad Request",
        message: "El producto no cuenta con stock",
      };

    const itemsJSON = await fs.promises.readFile(this.path, "utf-8");
    const items = JSON.parse(itemsJSON);
    if (items.some((cart) => cart.id === parseInt(cid))) {
      const idx = items.findIndex((cart) => cart.id === parseInt(cid));
      if (items[idx].products.some((prod) => prod.product === parseInt(pid))) {
        const idxProd = items[idx].products.findIndex(
          (prod) => prod.product === parseInt(pid)
        );
        items[idx].products[idxProd].quantity =
          items[idx].products[idxProd].quantity + 1;
      } else {
        items[idx].products.push({ product: pid, quantity: 1 });
      }

      await productManager.updateProductStock(pid, product.stock - 1);
      await fs.promises.writeFile(this.path, JSON.stringify(items));
      return {
        code: 200,
        status: "Ok",
        message: "Producto agreado al carrito",
      };
    }
    return {
      code: 400,
      status: "Bad Request",
      message: "Carrito no encontrado",
    };
  }

  loadFile = async () => {
    if (!fs.existsSync(this.path)) {
      fs.promises.writeFile(this.path, "[]");
      this.idIncrement = 1;
    } else {
      const itemsJSON = await fs.promises.readFile(this.path, "utf-8");
      const items = JSON.parse(itemsJSON);
      this.idIncrement = items.length + 1;
    }
  };
}

export default CartManager;