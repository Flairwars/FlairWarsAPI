/**
 * This is the RedditUser Schema. It contains...
 * A mapping for Reddit Usernames to Flairwars Color.
 * It will also contain what color they should be used for in counts
 * 
 */

const mongoose = require('mongoose')

module.exports.Schema = new mongoose.Schema({
    RedditUsername: {
        type: String,
        unique: true
    },
    FlairwarsColor: { type: mongoose.Schema.Types.ObjectId, ref: 'FWColors' },
    CountAliases: [ String ],
    Verified: Boolean
})

module.exports.Model = mongoose.model("RedditUsers", exports.Schema)