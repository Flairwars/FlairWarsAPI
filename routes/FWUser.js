const express = require('express')
const router = express.Router()

const FWUserOps = require('../db/operations/FWUser')
const ProtectRoute = require('../auth/protected')

const validate = require('../util/vaildation')
const dbh = require('../util/dbUtils')
const { PermissionTypes } = require('../db/operations/application')
const { compare } = require('../auth/hashHandler')

//  Collection Level Routes

//      Create Operations

// Create a FWUser

router.post('/', (req, res) => {

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['redditUsername', 'discordMemberId'])) {
            FWUserOps.CreateFWUser(req.body.redditUsername, req.body.discordMemberId, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Read Operations

// Read all

router.get('/', (req, res) => {
    FWUserOps.GetAllFWUsers(dbRes => {
        dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
    })
})

//      Update Operations
//      Delete Operations

// Delete all

router.delete('/', (req, res) => {
    let RouteOperation = () => {
        FWUserOps.DeleteAllFWUsers(dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('DELETE', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

//  Document Level Routes

//      Create Operations

// Post: Attempt login

router.post('/:FWUser', (req, res) => {
    let RouteOperation = () => {
        if(validate.BodyEvery(req.body, ['WPPassword'])){
            FWUserOps.GetOneFWUser(req.params.FWUser, dbRes => {
                // can't use dbutil sendresponse here sadly
                if(dbRes == 'DBERR'){
                    res.status(500).send('Server Error: Database Error')
                } else {
                    compare(req.body['WPPassword'], dbRes.WPPassword, (hashRes) => {
                        if(hashRes === 'HASHERR'){
                            res.status(500).send('Server Error')
                        } else {
                            if(hashRes){
                                res.status(200).send(dbRes)
                            } else {
                                res.status(403).send('Forbidden: Incorrect username or password')
                            }
                        }
                    })
                }
            })
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Read Operations

// Read one

router.get('/:FWUser', (req, res) => {
    let RouteOperation = () => {
        FWUserOps.GetOneFWUser(req.params.FWUser, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Update Operations

// Update RedditUser, DiscordId, or WPNickname

router.put('/:FWUser', (req, res) => {
    let RouteOperation = () => {

    }

    ProtectRoute([], req, res, RouteOperation)
})


// Set Password

router.post('/:FWUser/credentials', (req, res) => {
    let RouteOperation = () => {
        if(validate.BodyEvery(req.body, ['WPPassword'])){
            FWUserOps.SetWPPassword(req.params.FWUser, req.body.WPPassword, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
            })
        }
    }

    ProtectRoute([PermissionTypes.CanManagePasswords], req, res, RouteOperation)
})

// Update password

router.put('/:FWUser/credentials', (req, res) => {
    let RouteOperation = () => {
        
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Add Permissions

router.put('/:FWUser/permissions', (req, res) => {
    let RouteOperation = () => {

    }

    ProtectRoute([], req, res, RouteOperation)
})

// Add Govroles

router.put('/:FWUser/govroles', (req, res) => {
    let RouteOperation = () => {

    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Delete Operations

// Remove Permissions

router.delete('/:FWUser/permissions', (req, res) => {
    let RouteOperation = () => {

    }

    ProtectRoute([], req, res, RouteOperation)
})

// Remove Govroles

router.delete('/:FWUser/govroles', (req, res) => {
    let RouteOperation = () => {

    }

    ProtectRoute([], req, res, RouteOperation)
})

module.exports = router