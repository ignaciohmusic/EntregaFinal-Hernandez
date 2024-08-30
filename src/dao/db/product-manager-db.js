import ProductModel from "../models/product.model.js";

class ProductManager {
  async addProduct(title, description, code, price, status, stock, category, thumbnails) {
    try {
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return;
        }
          
        const productExists = await ProductModel.findOne({ code: code });

        if (productExists) {
            console.log("El codigo tiene que ser unico");
            return;
        }

        const newProduct = new ProductModel({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || []
        })
      
        await newProduct.save();

    } catch (error) {
        console.log("Error al agregar producto");
        throw error;  
    }
  }

  async getProducts({limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }
      const sortOptions = {};
      if (sort) {
          if (sort === 'asc' || sort === 'desc') {
              sortOptions.price = sort === 'asc' ? 1 : -1;
          }
      }
      const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
      const totalProducts = await ProductModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      
      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
      
    } catch (error) {
      console.log("Error al obtener los produtos", error);
    }
  }

  async getProductById(_id) {
    try {
      const arrayProducts = await ProductModel.findById(_id);

      if (!arrayProducts) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return arrayProducts;
      }
    } catch (error) {
      console.log("Error al buscar por id", error);
    }
  }

  async updateProduct(_id, updatedProduct) {
    try {
        const updated = await ProductModel.findByIdAndUpdate(_id, updatedProduct);
        if(!updated) {
            console.log("No se encuentra el producto");
            return null;
        }
        console.log("Product actualizado con exito");
        return updated;
    } catch (error) {
        console.log("Error al actualizar el producto"); 
    }
  }

  
  async deleteProduct(_id) {
    try {
        const deleted = await ProductModel.findByIdAndDelete(_id);
  
        if (!deleted) {
            console.log("No se encuentra el producto");
            return null;
        } 
        console.log("Producto eliminado");
    } catch (error) {
      console.log("Tenemos un error al eliminar productos", error);
      throw error;
    }
  }
}

export default ProductManager;