class Product {
  static id = 0;
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.id++;
  }
}
class ProductManager {
  #products;
  #productDirPath;
  #productsFilePath;
  #fileSystem;
  constructor() {
    this.#products = [];
    this.#productDirPath = "./module1/files";
    this.#productsFilePath = this.#productDirPath + "/Products.json";
    this.#fileSystem = require("fs");
  }
  #prepareDir = async () => {
    await this.#fileSystem.promises.mkdir(this.#productDirPath, {
      recursive: true,
    });
    if (!this.#fileSystem.existsSync(this.#productsFilePath)) {
      await this.#fileSystem.promises.writeFile(this.#productsFilePath, "[]");
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    let newProduct = new Product(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    try {
      await this.getProducts();
      if (title && description && price && thumbnail && code && stock) {
        if (this.#products.some((product) => product.code === code)) {
          console.log("Codigo repetido");
        } else {
          this.#products.push(newProduct);
          console.log("Lista actualizada de productos: ");
          console.log(this.#products);
          await this.#fileSystem.promises.writeFile(
            this.#productsFilePath,
            JSON.stringify(this.#products)
          );
        }
      } else {
        console.log("no se aceptan valores null, undefined, o vacios");
      }
    } catch (error) {
      console.error(
        `Error creando producto nuevo: ${JSON.stringify(
          newProduct
        )}, detalle del error: ${error}`
      );
      throw Error(
        `Error creando producto nuevo: ${JSON.stringify(
          newProduct
        )}, detalle del error: ${error}`
      );
    }
  };
  getProducts = async () => {
    try {
      await this.#prepareDir();
      let prodFile = await this.#fileSystem.promises.readFile(
        this.#productsFilePath,
        "utf-8"
      );
      console.info("Archivo JSON obtenido desde archivo: ");
      console.log(prodFile);
      this.#products = JSON.parse(prodFile);
      console.log("Productos encontrados: ");
      console.log(this.#products);
      return this.#products;
    } catch (error) {
      console.error(`Error consultando los productos por archivo, valide el archivo: ${
        this.#productDirPath
      }, 
          detalle del error: ${error}`);
      throw Error(`Error consultando los productos por archivo, valide el archivo: ${
        this.#productDirPath
      },
       detalle del error: ${error}`);
    }
  };
  getProductById = async (code) => {
    await this.getProducts();
    const productfilter = this.#products.find(
      (product) => product.code === code
    );
    if (productfilter) {
      console.log("Producto encontrado:" + productfilter.title);
    } else {
      console.log("Codigo: " + code + " no arroja resultados");
    }
  };

  updateProduct = () => {};
  deleteProduct = () => {};
}
let productManager = new ProductManager();
