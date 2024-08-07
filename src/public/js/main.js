const socket = io();

socket.on("products", (data) => {
    console.log("Productos recibidos:", data);
    renderProducts(data)
})

const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";
    products.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                        <p> ID: ${item.id} </p>
                        <p>Title: ${item.title}</p>
                        <p>Description: ${item.description}</p>
                        <p>Price: ${item.price}</p>
                        <p>Stock: ${item.stock}</p>
                        <p>Category: ${item.category}</p>
                        <button> Delete Product </button>
                      `;
        productsContainer.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id)          
        })
    })
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

document.getElementById("Send").addEventListener("click", () => {
     addProduct();
})


const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        thumbnails: document.getElementById("thumbnails").value,
        status: document.getElementById("status").value === "true"
    };
    console.log("Producto a agregar:", product);
    socket.emit("addProduct", product);
}