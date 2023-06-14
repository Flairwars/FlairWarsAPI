/**
 * This is the FWColor Schema. It contains...
 * All data related to FlairWars Color Teams
 * 
 */

const mongoose = require('mongoose')

module.exports.Schema = new mongoose.Schema({
    ColorName: {
        type: String,
        unique: true
    },
    Subreddits: [
        {
            subredditType: String,
            subredditName: String
        }
    ],
    Flags: [
        {
            flagType: String,
            flagUrl: String
        }
    ],
    Servers: [
        {
            serverType: String,
            serverInviteUrl: String
        }
    ],
    GovernmentRoles: [
        {
            roleTitle: String,
            roleDiscordRoles: [{
                ServerID: String,
                RoleID: String
            }],
            rolePermissions: [ String ]
        }
    ],
    VictoryTracker: [
        {
            trackerType: String,
            trackerData: mongoose.SchemaTypes.Mixed
        }
    ]
})

module.exports.Model = mongoose.model("FWColors", exports.Schema)