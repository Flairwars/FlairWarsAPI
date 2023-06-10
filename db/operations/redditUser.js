/** 
 * Operations for a RedditUser in the database
 */

// Import model/schema
const redditUser = require('../schema/redditUser')

// Additional Imports
const FWColorOps = require('./FWColor')

// Utility Functions



// CREATE OPERATIONS

/**
 * Create a Reddit User
 * @param {String} redditUsername 
 * @param {String} fwColorName 
 * @param {Function} cb 
 */

module.exports.CreateRedditUser = (redditUsername, fwColorName, cb) => {
    FWColorOps.GetColorByColorName(fwColorName, dbRes => {
        if (dbRes === 'DBERR' || dbRes === 'NOTFOUND') {
            cb(dbRes)
        }
        else {
            let newRedditUser = new redditUser.Model({
                RedditUsername: redditUsername,
                FlairwarsColor: dbRes._id,
                CountAliases: [],
                Verified: true // TODO: replace
            })

            newRedditUser.save()

            cb(newRedditUser)
        }
    })
}

/**
 * Create a count alias for this user
 * @param {String} redditUsername 
 * @param {String} countColor 
 * @param {Function} cb 
 */

module.exports.CreateCountAlias = (redditUsername, countColor, cb) => {
    redditUser.Model.findOne({RedditUsername: redditUsername}, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            FWColorOps.GetColorByColorName(countColor, dbRes => {
                if (dbRes === 'DBERR' || dbRes === 'NOTFOUND') {
                    cb(dbRes)
                }
                else {
                    res.CountAliases.push(dbRes._id)

                    res.save()

                    cb(res)
                }
            })
        }
        else {
            cb('NOTFOUND')
        }
    })
}

// READ OPERATIONS

/**
 * Read all RedditUsers from the database
 * @param {Function} cb 
 */

module.exports.ReadAllRedditUsers = (cb) => {
    redditUser.Model.find({}).populate('FlairwarsColor').exec((err, res) => {
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

/**
 * Return one user
 * @param {String} redditUsername 
 * @param {Function} cb 
 */

module.exports.ReadOneRedditUser = (redditUsername, cb) => {
    redditUser.Model.findOne({RedditUsername: redditUsername}).populate('FlairwarsColor').exec((err, res) => {
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
 * Set the Verification state of a User
 * @param {String} redditUsername 
 * @param {Boolean} verifiedStatus 
 * @param {Function} cb 
 */

module.exports.SetVerification = (redditUsername, verifiedStatus, cb) => {
    redditUser.Model.findOne({RedditUsername: redditUsername}, (err, res) => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else if (res) {
            res.Verified = verifiedStatus

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
 * Delete all RedditUsers from the database 
 * @param {Function} cb 
 */

module.exports.DeleteAllRedditUsers = (cb) => {
    redditUser.Model.deleteMany({}, {}, err => {
        if (err) {
            console.error(err)
            cb('DBERR')
        }
        else {
            cb('NOCONTENT')
        }
    })
}

/**
 * Delete a count alias from a user
 * @param {String} redditUsername 
 * @param {String} countColor 
 * @param {Function} cb 
 */

module.exports.DeleteCountAlias = (redditUsername, countColor, cb) => {
    FWColorOps.GetColorByColorName(countColor, dbRes => {
        if (dbRes === 'DBERR' || dbRes === 'NOTFOUND') {
            cb(dbRes)
        }
        else {
            redditUser.Model.findOne({RedditUsername: redditUsername}, (err, res) => {
                if (err) {
                    console.error(err)
                    cb('DBERR')
                }
                else if (res) {
                    if (res.CountAliases.includes(dbRes._id)) {
                        res.CountAliases = res.CountAliases.splice(res.CountAliases.indexOf(dbRes._id), 1)
                    }
        
                    res.save()
        
                    cb(res)
                }
                else {
                    cb('NOTFOUND')
                }
            })
        }
    })
}