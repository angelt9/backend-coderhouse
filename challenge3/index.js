const express = require("express");
const Container = require("./container");
const products = new Container("products");

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Open server on port ${PORT}`);
});

app.get("/products", (req, res) => {
  products
    .getAll()
    .then((data) => res.send(data))
    .catch((error) => {
      console.log(error.message);
      res.send({ error: error.message });
    });
});

app.get("/randomProd", (req, res) => {
  products
    .getAll()
    .then((data) => {
      const random = Math.floor(Math.random() * data.length);
      res.send(data[random]);
    })
    .catch((error) => {
      console.log(error.message);
      res.send({ error: error.message });
    });
});

server.on("error", (error) => console.log("Server error:", error));