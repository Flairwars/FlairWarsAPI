/**
 * This is the FWUser Schema. It contains...
 * A reference to their Reddit information
 * Whether or not they have been verified before
 * Their Discord ID
 * Their login information for the WebPanel
 * Their system-level permissions (Admin, Developer, etc.)
 */

const mongoose = require('mongoose')

module.exports.Schema = new mongoose.Schema({
    RedditInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'RedditUsers' },
    DiscordID: {
        type: String,
        unique: true
    },
    WPNickname: String,
    WPPassword: String,
    Permissions: [],
    GovRoles: []
})

module.exports.Model = mongoose.model("FWUsers", exports.Schema)