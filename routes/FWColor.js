const express = require('express')
const router = express.Router()

const ColorOps = require('../db/operations/FWColor')
const ProtectRoute = require('../auth/protected')

const validate = require('../util/vaildation')
const dbh = require('../util/dbUtils')

// Collection Level Routes

//      Create Operations

router.post('/', (req, res) => {
    const RequiredPermissions = []
    const RouteOperation = () => {
        let CreateColorFields = ['ColorName', 'MainSub', 'FlagImgUrl', 'ServerInviteUrl', 'DefaultColorRole']
        if (validate.BodyEvery(req.body, CreateColorFields)) {
            ColorOps.CreateFWColor(
                req.body.ColorName,
                req.body.MainSub,
                req.body.FlagImgUrl,
                req.body.ServerInviteUrl,
                req.body.DefaultColorRole,
                dbRes => {
                    dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
                }
            )
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute(RequiredPermissions, req, res, RouteOperation)
})


//      Read Operations

router.get('/', (req, res) => {

    ColorOps.GetAllFWColors( dbRes => {
        dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
    })

})

//      Update Operations

router.put('/', (req, res) => {

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['fieldName','fieldValue'])) {
            if (Object.keys(req.query).includes('operation')) {
                ColorOps.UpdateCollectionField(req.body.fieldName, req.body.fieldValue, req.query.operation, dbRes => {
                    dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
                })
            }
            else {
                ColorOps.UpdateCollectionField(req.body.fieldName, req.body.fieldValue, 'replace', dbRes => {
                    dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
                })
            }
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }
    
    ProtectRoute([], req, res, RouteOperation)
})

//      Delete Operations

router.delete('/', (req, res) => {

    let RouteOperation = () => {
        ColorOps.DeleteCollection( dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('DELETE', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
    
})

// Document Level Routes

//      Create Operations

// Create a Color Subreddit - POST /:updateColor/subreddits
router.post('/:updateColor/subreddits', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['type', 'url'])) {
            ColorOps.CreateColorSubreddit(UpdateColor, req.body.type, req.body.url, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }
    
    ProtectRoute([], req, res, RouteOperation)
})

// Create a Color Flag - POST /:updateColor/flags
router.post('/:updateColor/flags', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['type', 'url'])) {
            ColorOps.CreateColorFlag(UpdateColor, req.body.type, req.body.url, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Create a Color Server - POST /:updateColor/servers
router.post('/:updateColor/servers', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['type', 'url'])) {
            ColorOps.CreateColorServer(UpdateColor, req.body.type, req.body.url, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Create a Color Role - POST /:updateColor/roles
router.post('/:updateColor/roles', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['roleTitle', 'ServerID', 'RoleID'])) {
            ColorOps.CreateColorRole(UpdateColor, req.body.roleTitle, req.body.ServerID, req.body.RoleID, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('POST', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Create a Color Tracker - POST /:updateColor/trackers
router.post('/:updateColor/trackers', (req, res) => {
    let UpdateColor = req.params.updateColor
    
    let RouteOperation = () => {
        if (validate.BodyEvery(req.body, ['trackerType', 'trackerData'])) {
            ColorOps.CreateColorTracker(UpdateColor, req.body.trackerType, req.body.trackerData, dbRes => {
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

router.get('/:updateColor', (req, res) => {
    let UpdateColor = req.params.updateColor

    ColorOps.GetFWColorByName(UpdateColor, dbRes => {
        dbh.SendResponse(dbh.dbStatusHandler('GET', dbRes), res)
    })
})

//      Update Operations

// Update color name
router.put('/:updateColor', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        if (req.body.hasOwnProperty('ColorName')) {
            ColorOps.UpdateColorName(UpdateColor, req.body.ColorName, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
            })
        }
        else {
            res.status(400).send('Bad Request: Incomplete request body')
        }
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Update a subreddit
router.put('/:updateColor/subreddits/:subredditId', (req, res) => {
    let UpdateColor = req.params.updateColor
    let UpdateSubreddit = req.params.subredditId

    let RouteOperation = () => {
        ColorOps.UpdateSubreddit(UpdateColor, UpdateSubreddit, req.body, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Update a flag
router.put('/:updateColor/flags/:flagsId', (req, res) => {
    let UpdateColor = req.params.updateColor
    let UpdateFlag = req.params.flagsId

    let RouteOperation = () => {
        ColorOps.UpdateFlag(UpdateColor, UpdateFlag, req.body, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Update a Server
router.put('/:updateColor/servers/:serverId', (req, res) => {
    let UpdateColor = req.params.updateColor
    let UpdateServer = req.params.serverId

    let RouteOperation = () => {
        ColorOps.UpdateServer(UpdateColor, UpdateServer, req.body, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Update a Role
router.put('/:updateColor/roles/:roleId', (req, res) => {
    let UpdateColor = req.params.updateColor
    let UpdateRole = req.params.updateRole

    let RouteOperation = () => {
        ColorOps.UpdateRole(UpdateColor, UpdateRole, req.body, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

// Update a Victory Tracker
router.put('/:updateColor/trackers/:trackerId', (req, res) => {
    let UpdateColor = req.params.updateColor
    let UpdateTracker = req.params.trackerId

    let RouteOperation = () => {
            ColorOps.UpdateTracker(UpdateColor, UpdateTracker, req.body, dbRes => {
                dbh.SendResponse(dbh.dbStatusHandler('PUT', dbRes), res)
            })
    }

    ProtectRoute([], req, res, RouteOperation)
})

//      Delete Operations

// Delete the target color from the database
router.delete('/:updateColor', (req, res) => {
    let UpdateColor = req.params.updateColor

    let RouteOperation = () => {
        ColorOps.DeleteFWColorByName(UpdateColor, dbRes => {
            dbh.SendResponse(dbh.dbStatusHandler('DELETE', dbRes), res)
        })
    }

    ProtectRoute([], req, res, RouteOperation)
})

module.exports = router