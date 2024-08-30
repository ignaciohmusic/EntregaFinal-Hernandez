import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ignacioh12:ignacio10@clusterignacio.ce2oh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ClusterIgnacio")
        .then(() => console.log("Conexión exitosa"))
        .catch(() => console.log("Error al realizar la conexion"))