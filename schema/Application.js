/**
 * This is the Application Schema. It contains...
 * Database Schema for Application Configuration Objects in the database
 * 
 * 
 */

const mongoose = require('mongoose')

module.exports.Schema = new mongoose.Schema({
    AppName: String,
    Permissions: [],
    Secret: String
})

module.exports.Model = mongoose.model("Apps", exports.Schema)

module.exports.MapOutput = () => {
    
}