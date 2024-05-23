// Importing the mongoose library for working with MongoDB.
import mongoose from "mongoose";

// Importing the Mongoose module for type declarations.
import Mongoose = require("mongoose");

// Defining an interface IOffersModel which extends Mongoose.Document.
// This interface represents the structure of an offer document in the MongoDB collection.
interface IOffersModel extends Mongoose.Document
{
    // Property for the offer ID associated with the offer.
    offerId : number;
    
    // Property for the name of the offer.
    name : string;

    // Property for the description of the offer.
    description : string;

    // Property for the validity period of the offer.
    validity : string;

    // Property for the image URL associated with the offer.
    image : string;
}

// Exporting the IOffersModel interface for use in other parts of the application.
export {IOffersModel};