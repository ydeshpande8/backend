// Importing the mongoose library for working with MongoDB
import mongoose from "mongoose";

// Importing the Mongoose module for type declarations.
import Mongoose = require("mongoose");

// Defining an interface IBudgetModel which extends Mongoose.Document.
// This interface represents the structure of a budget document in the MongoDB collection.
interface IBudgetModel extends Mongoose.Document
{
    // Property for the user ID associated with the budget.
    // userId : number;
    userId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;

    // Property for the category ID associated with the budget.
    // categoryId : number;

    // Property for the budget ID associated with the budget.
    budgetId : number;

    // Property for the type of the budget (e.g., income or expense).
    type : string;

    // Property for the amount of the budget.
    amount : number;

    // Property for the date of the budget entry.
    date : Date;

    // Property for any additional notes related to the budget.
    note : string;

    // Property for showcasing remaining amount of the budget.
    // remainingAmount : number;
}

// Exporting the IBudgetModel interface for use in other parts of the application.
export {IBudgetModel};