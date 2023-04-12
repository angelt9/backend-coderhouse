const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];

    try {
      if (fs.existsSync(this.path)) {
        const jsonFile = fs.readFileSync(this.path, "utf-8");
        const data = JSON.parse(jsonFile);
        this.products = data;
      } else {
        fs.writeFileSync(this.path, JSON.stringify(this.products));
      }
    } catch (err) {
      return "Error " + err;
    }
  }

  addProduct(product) {
    const isRepeated = this.products.some(
      (productSaved) => productSaved.code == product.code
    );

    if (
      isRepeated == false &&
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock
    ) {
      this.products.push({
        id: this.products.length + 1,
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
      });

      const jsonData = JSON.stringify(this.products);
      fs.writeFileSync(this.path, jsonData);

      return "Item added";
    } else {
      return "Repeated code";
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const productById = this.products.find((product) => product.id == id);
    if (productById) {
      return productById;
    } else {
      return "Item not found with id " + id;
    }
  }

  updateProduct(id, updatedProduct) {
    const productToUpdate = this.products.find((product) => product.id == id);
    if (productToUpdate) {
      const isRepeated = this.products.some(
        (productSaved) => productSaved.code == updatedProduct.code
      );
      if (isRepeated == false) {
        this.products[id - 1] = {
          ...this.products[id - 1],
          ...updatedProduct,
        };

        const jsonData = JSON.stringify(this.products);
        fs.writeFileSync(this.path, jsonData);
        return "Item updated";
      } else {
        return "There is already an item with code " + updatedProduct.code;
      }
    } else {
      return "Item not found with id " + id;
    }
  }

  deleteProduct(id) {
    const productToDelete = this.products.find((product) => product.id == id);
    if (productToDelete) {
      this.products = this.products.filter((product) => product.id !== id);
      const jsonData = JSON.stringify(this.products);
      fs.writeFileSync(this.path, jsonData);
      return "Item deleted";
    } else {
      return "Item not found with id " + id;
    }
  }
}
