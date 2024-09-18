import mongoose from "mongoose";

async function conectaNaDataBase() {
  mongoose.connect("mongodb+srv://arielspencer:UCyNiYm9VQA59t7x@cluster0.0jege.mongodb.net/livraria?retryWrites=true&w=majority&appName=Cluster0");

  return mongoose.connection;
};

export default conectaNaDataBase;
