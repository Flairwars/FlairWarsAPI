/** 
 * Operations for FWColor Objects in the database
 */

// Import model/schema
const FWColor = require('../schema/FWColor')

// Utility Functions

/**
 * Get a color by its color name
 * @param {String} ColorName 
 * @param {Function} cb 
 */

module.exports.GetColorByColorName = (ColorName, cb) => {
    FWColor.Model.findOne({ColorName: ColorName}, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}


// CREATE OPERATIONS

/**
 * This function creates a new Flairwars Color. Obviously this should be used sparingly, if ever.
 * @param {String} ColorName The name of the FW Color
 * @param {String} MainSub The home subreddit of the color (not including r/)
 * @param {String} FlagImgUrl The URL for the main flag of the color
 * @param {String} serverInviteUrl A Server Invite URL for the color's main server
 * @param {String} defaultColorRole The default role ID given to this color in the megaserver
 * @param {Function} cb This will have the new document in it
 * 
 */

module.exports.CreateFWColor = (ColorName, MainSub, FlagImgUrl, serverInviteUrl, defaultColorRole, cb) => {
    let newColor = new FWColor.Model({
        ColorName: ColorName,
        Subreddits: [
            {
                subredditType: 'main',
                subredditName: MainSub
            }
        ],
        Flags: [
            {
                flagType: 'main',
                flagUrl: FlagImgUrl
            }
        ],
        Servers: [
            {
                serverType: 'main',
                serverInviteUrl: serverInviteUrl
            }
        ],
        GovernmentRoles: [
            {
                roleTitle: 'Member',
                roleDiscordRoles: [ {
                    ServerID: "463794005231271976",
                    RoleID: defaultColorRole
                } ],
                rolePermissions: []
            }
        ],
        VictoryTracker: []
    })

    newColor.save()

    cb(newColor)
}


/**
 * This function creates a Subreddit in the given color
 * @param {String} colorName The name of the color
 * @param {String} subType The type of the subreddit (main, battle, etc.)
 * @param {String} subUrl The URL of the subreddit (just the sub name, no /r)
 * @param {Function} cb Callback function containing new Color document or error if there was one
 */

module.exports.CreateColorSubreddit = (colorName, subType, subUrl, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: colorName}, {_id: colorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Subreddits.push({
                subredditType: subType,
                subredditName: subUrl
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * This function creates a flag for a color in the database
 * @param {String} colorName The name of the color you're creating a flag for
 * @param {String} flagType The type of flag (main, war, battle, etc.)
 * @param {String} flagUrl The url where the flag can be found
 * @param {Function} cb Callback function containing the updated color or error if there was one
 */

module.exports.CreateColorFlag = (colorName, flagType, flagUrl, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: colorName}, {_id: colorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Flags.push({
                flagType: flagType,
                flagUrl: flagUrl
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * This function creates a server for a color in the database
 * @param {String} colorName The name of the color you're creating a server for
 * @param {String} serverType The type of server (main, battle, lore, rp, etc.)
 * @param {String} serverUrl A server invite url
 * @param {Function} cb Callback function containing the updated color document or error string if there was one
 */

module.exports.CreateColorServer = (colorName, serverType, serverUrl, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: colorName}, {_id: colorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Servers.push({
                serverType: serverType,
                serverInviteUrl: serverUrl
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * This function creates a role for a color in the database
 * @param {String} colorName The name of the color you're creating a role for
 * @param {String} roleName The name of the role
 * @param {String} roleServer The server ID that the discord ID for this role is
 * @param {String} roleId The discord role ID for this role
 * @param {Function} cb Callback function containing the updated color document or error string
 */

module.exports.CreateColorRole = (colorName, roleName, roleServer, roleId, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: colorName}, {_id: colorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.GovernmentRoles.push({
                roleTitle: roleName,
                roleDiscordRoles: [{
                    ServerID: roleServer,
                    RoleID: roleId
                }],
                rolePermissions: []
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * This function creates a tracker for a color in the database
 * @param {String} colorName The name of the color you're creating a tracker for
 * @param {String} trackerType The name of the tacker type (VP, Totem, etc.)
 * @param {String} trackerData Data for the tracker (unopinionated - array of totems, number of vp, etc.)
 * @param {Function} cb Callback function containing the updated color document or error string
 */

module.exports.CreateColorTracker = (colorName, trackerType, trackerData, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: colorName}, {_id: colorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.VictoryTracker.push({
                trackerType: trackerType,
                trackerData: trackerData
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

// READ OPERATIONS

/**
 * This function will return all of the FWColor Documents
 * @param {Function} cb A callback function that will recieve the results of the query or an error if there was one
 */

module.exports.GetAllFWColors = (cb) => {
    FWColor.Model.find({}, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else {
            cb(res)
        }
    })
}

/**
 * This function will return a FWColor document given a color name
 * @param {String} ColorName The name of the color you are querying for
 * @param {Function} cb A callback function that will recieve the results of the query or an error if there was one
 */

module.exports.GetFWColorByName = (ColorName, cb) => {
    FWColor.Model.findOne( { $or: [ {ColorName: ColorName}, {_id: ColorName} ] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

// UPDATE OPERATIONS

/**
 * This function is used for adding a new field to all documents in a collection
 * @param {String} fieldName The name of the new field
 * @param {String} defaultValue The default value of the new field
 * @param {Function} cb The callback function with either the error raised or results from update
 */

module.exports.UpdateCollectionField = (fieldName, fieldValue, operation, cb) => {
    let UpdateField = {}
    UpdateField[fieldName] = fieldValue

    console.log(UpdateField)
    
    switch(operation) {
        case 'replace':
            FWColor.Model.updateMany({}, {$set: UpdateField}, {multi: true, upsert: false}, (err, res) => {
                if (err) {
                    console.error(err)
                    cb('DBERR')
                }
                else {
                    console.log(res)
                    cb(res)
                }
            })
            break;
        
        case 'append':
            FWColor.Model.updateMany({}, {$push: UpdateField}, {multi: true, upsert: false}, (err, res) => {
                if (err) {
                    console.error(err)
                    cb(err)
                }
                else {
                    console.log(res)
                    cb(res)
                }
            })
            break;
        
        default:
            cb('Unrecognized operation')
    }
    
}

/**
 * Update the Name of a color
 * @param {String} ColorName 
 * @param {String} NewColorName 
 * @param {Function} cb 
 */

module.exports.UpdateColorName = (ColorName, NewColorName, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.ColorName = NewColorName
            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * Update a subreddit of a color
 * @param {String} ColorName 
 * @param {String} SubredditId 
 * @param {Object} updateBody 
 * @param {Function} cb 
 */

module.exports.UpdateSubreddit = (ColorName, SubredditId, updateBody, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Subreddits.forEach( subreddit => {
                if (SubredditId == subreddit._id) {
                    if (updateBody.hasOwnProperty('type')) {
                        subreddit.subredditType = updateBody.type
                    }
                    if (updateBody.hasOwnProperty('url')) {
                        subreddit.subredditName = updateBody.url
                    }
                }
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * Update a flag of a color
 * @param {String} ColorName 
 * @param {String} FlagId 
 * @param {Object} updateBody 
 * @param {Function} cb 
 */

module.exports.UpdateFlag = (ColorName, FlagId, updateBody, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Flags.forEach( flag => {
                if (FlagId == flag._id) {
                    if (updateBody.hasOwnProperty('type')) {
                        flag.flagType = updateBody.type
                    }
                    if (updateBody.hasOwnProperty('url')) {
                        flag.flagUrl = updateBody.url
                    }
                }
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * Update a Server of a color
 * @param {String} ColorName 
 * @param {String} ServerId 
 * @param {Object} updateBody 
 * @param {Function} cb 
 */

module.exports.UpdateServer = (ColorName, ServerId, updateBody, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Servers.forEach( server => {
                if (ServerId == server._id) {
                    if (updateBody.hasOwnProperty('type')) {
                        server.serverType = updateBody.type
                    }
                    if (updateBody.hasOwnProperty('url')) {
                        server.serverInviteUrl = updateBody.url
                    }
                }
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

module.exports.UpdateRole =  (ColorName, RoleId, updateBody, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.GovernmentRoles.forEach( role => {
                if (RoleId == role._id) {
                    if (updateBody.hasOwnProperty('roleTitle')) {
                        role.roleTitle = updateBody.roleTitle
                    }

                    if (updateBody.hasOwnProperty('rolePermissions')) {
                        role.rolePermissions = updateBody.rolePermissions
                    }

                    if (updateBody.hasOwnProperty('addDiscordRole')) {
                        role.roleDiscordRoles = [... new Set([...role.roleDiscordRoles,...updateBody.addDiscordRole])]
                    }

                    if (updateBody.hasOwnProperty('removeDiscordRole')) {
                        role.roleDiscordRoles = role.roleDiscordRoles.filter(n => !updateBody.removeDiscordRole.includes(n))
                    }
                }
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

/**
 * 
 * @param {String} ColorName 
 * @param {String} TrackerId 
 * @param {Object} updateBody 
 * @param {Function} cb 
 */

module.exports.UpdateTracker = (ColorName, TrackerId, updateBody, cb) => {
    FWColor.Model.findOne( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.VictoryTracker.forEach( tracker => {
                if (TrackerId == tracker._id) {
                    if (updateBody.hasOwnProperty('trackerType')) {
                        tracker.trackerType = updateBody.type
                    }
                    if (updateBody.hasOwnProperty('trackerData')) {
                        tracker.trackerData = updateBody.trackerData
                    }
                }
            })

            res.save()

            cb(res)
        }
        else {
            cb('NOTFOUND')
        }
    })
}

// DELETE OPERATIONS

/**
 * This function deletes a FWColor from the database. Should only be used on Green
 * @param {*} ColorName The name of the color to be deleted
 * @param {*} cb A callback function that will recieve the deleted document or an error if there was one
 */

module.exports.DeleteFWColorByName = (ColorName, cb) => {
    FWColor.Model.findOneAndDelete( { $or: [{ColorName: ColorName}, {_id: ColorName}] }, {}, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else {
            cb(res)
        }
    })
}

/**
 * This function will delete all FWColors from the database
 * @param {Function} cb Will contain the error thrown if there is one, otherwise true
 */

module.exports.DeleteCollection = (cb) => {
    FWColor.Model.deleteMany({}, {}, (err) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else {
            cb(true)
        }
    })
}