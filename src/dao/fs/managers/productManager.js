import { promises as fs } from "fs";

class ProductManager {
  static ultId = 0;
  
  constructor(path) {
    this.path = path;
    this.products = [];
    this.cargarArray();
  }

  async readFile() {
    const data = await fs.readFile(this.path, 'utf-8');
    const arrayProducts = JSON.parse(data);
    return arrayProducts;
  }
  
  async saveFile(arrayProducts = this.products) {
    await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
  }
  
  async cargarArray() {
    try {
      this.products = await this.readFile();
    } catch (error) {
      console.log("Error al iniciar productManager:", error);
    }
  }
  
  async addProduct(title, description, code, price, status, stock, category, thumbnails) {
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      return;
    }
    if (this.products.some(item => item.code === code)) {
      return;
    }

    const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    const newProduct = {
      id: lastProductId + 1,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };

    this.products.push(newProduct);
    
    await this.saveFile(this.products);
  }

  async getProducts() {
    try {
      const products = await this.readFile();
      return products;
    } catch (error) {
      console.log("Error al leer los archivos:", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProducts = await this.readFile();
      const search = arrayProducts.find(item => item.id === id);

      if (!search) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return search;
      }
    } catch (error) {
      console.log("Error al buscar por id:", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
        const arrayProducts = await this.readFile(); 
        const index = arrayProducts.findIndex( item => item.id === id); 
        console.log("Índice encontrado:", index);
        if(index !== -1) {
            arrayProducts[index] = {...arrayProducts[index], ...updatedProduct}; 
            await this.saveFile(arrayProducts);
            console.log("Producto actualizado"); 
            return arrayProducts[index];
        } else {
            console.log("No se encuentra el producto"); 
        }
    } catch (error) {
        console.log("Tenemos un error al actualizar productos"); 
    }
  }

  
  async deleteProduct(id) {
    try {
      const arrayProducts = await this.readFile();
      const index = arrayProducts.findIndex(item => item.id === id);
  
      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveFile(arrayProducts);
        console.log("Producto eliminado");
      } else {
        console.log("No se encuentra el producto");
      }
    } catch (error) {
      console.log("Tenemos un error al eliminar productos:", error);
    }
  }
}

export default ProductManager;