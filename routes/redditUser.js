const express = require('express')
const router = express.Router()

const RedditUserOps = require('../db/operations/redditUser')
const ProtectRoute = require('../auth/protected')

const validate = require('../util/vaildation')
const dbh = require('../util/dbUtils')

//  Collection Level Routes

//      Create Operations

// Create a reddituser
router.post('/', (req, res) => {
    
    let RouteOperation = () => {
        let RequiredFields = ['RedditUsername', 'FlairwarsColor']

        if (validate.BodyEvery(req.body, RequiredFields)) {
            RedditUserOps.CreateRedditUser(req.body.RedditUsername, req.body.FlairwarsColor, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete/Incorrect request body')
        }
    }
    
    ProtectRoute([], req, res, RouteOperation)
})

//      Read Operations

// Get entire collection
router.get('/', (req, res) => {
    RedditUserOps.ReadAllRedditUsers(dbRes => {
        dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
    })
})

//      Update Operations
//      Delete Operations

// Delete collection
router.delete('/', (req, res) => {
    let RouteOperation = () => {
        RedditUserOps.DeleteAllRedditUsers(dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('DELETE', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

//  Document Level Routes

//      Create Operations

// Create a count alias

router.post('/:redditUsername', (req, res) => {
    const UserAliased = req.params.redditUsername

    let RouteOperation = () => {
        if (req.body.hasOwnProperty('color')) {
            RedditUserOps.CreateCountAlias(UserAliased, req.body.color, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Read Operations

// Get a single user

router.get('/:redditUsername', (req, res) => {
    const RedditUsername = req.params.redditUsername

    RedditUserOps.ReadOneRedditUser(RedditUsername, dbRes => {
        dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
    })
})

//      Update Operations

// Set Verification

router.put('/:redditUsername', (req, res) => {
    let RouteOperation = () => {
        const RedditUsername = req.params.redditUsername

        if (req.body.hasOwnProperty('Verified')) {
            if (req.body.Verified === true) {
                RedditUserOps.SetVerification(RedditUsername, true, dbRes => {
                    dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
                })
            }
            else if (req.body.Verified === false) {
                RedditUserOps.SetVerification(RedditUsername, false, dbRes => {
                    dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
                })
            }
            else {
                res.status(400).send('Bad Request: Incorrect request body')
            }
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Delete Operations

// Delete a count alias

router.delete('/:redditUsername', (req, res) => {
    let RouteOperation = () => {
        const RedditUsername = req.params.redditUsername

        if (req.body.hasOwnProperty('color')) {
            RedditUserOps.DeleteCountAlias(RedditUsername, req.body.color, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('DELETE', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

module.exports = router