// Importing the mongoose library for working with MongoDB.
import mongoose from "mongoose";

// Importing the Mongoose module for type declarations.
import Mongoose = require("mongoose");

// Defining an interface ICategoryModel which extends Mongoose.Document.
// This interface represents the structure of a category document in the MongoDB collection.
interface ICategoryModel extends Mongoose.Document
{
    // Property for the user ID associated with the category.
    //userId : mongoose.Types.ObjectId;

    // Property for the category ID associated with the budget.
    categoryId : number;

    // Property for the name of the category.
    name : string;

     // Property for the description of the category.
    description : string;
}

// Exporting the ICategoryModel interface for use in other parts of the application.
export {ICategoryModel};