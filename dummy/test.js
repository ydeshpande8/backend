// import mongoose from 'mongoose';
const mongoose = require('mongoose');

// Iterate through all registered models
Object.keys(mongoose.models).forEach(modelName => {
    // Get the model from the mongoose.models object
    const model = mongoose.models[modelName];
    // Log the model name and schema
    console.log(`Model: ${modelName}`);
    console.log(`Schema:`);
    console.log(model.schema);
});