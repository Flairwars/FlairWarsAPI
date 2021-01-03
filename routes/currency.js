const express = require('express')
const router = express.Router()

const CurrencyOps = require('../db/operations/currency')
const Currency = require('../db/schema/currency')
const AppOps = require('../db/operations/application')
const ProtectRoute = require('../auth/protected')

let MapCurrency = (currencyFromDB) => {
    return {
        id: currencyFromDB._id,
        Name: currencyFromDB.CurrencyName,
        Symbol: currencyFromDB.CurrencySymbol,
        RemainingStockpile: currencyFromDB.CurrencyRemainingStockpile,
        Stockpile: currencyFromDB.CurrencyTotalStockpile
    }
}

router.get('/', (req, res) => {
    if (Object.keys(req.query).length === 0) {
        CurrencyOps.ReadCurrencies().then( allCurrencies => {
            const responseArray = []
            allCurrencies.forEach( currency => {
                let AddedCurrency = MapCurrency(currency)
                responseArray.push(AddedCurrency)
            })
            res.status(200).send(responseArray)
        })
    }
    else {
        CurrencyOps.ReadCurrenciesByQuery({
            $or: [
                {CurrencyName: req.query.Name},
                {CurrencySymbol: req.query.Symbol},
                {_id: req.query.ID}
            ]
        }).then( queriedurrencies => {
            const responseArray = []
            queriedurrencies.forEach( currency => {
                let AddedCurrency = MapCurrency(currency)
                responseArray.push(AddedCurrency)
            })
            res.status(200).send(responseArray)
        })
    }
})

router.post('/', (req, res) => {

    const RoutePermissions = [AppOps.PermissionTypes.CanWriteCurrencies]

    const RouteOperation = () => {
        const RequiredFields = ['Name', 'Symbol']
        if (RequiredFields.every( item => req.body.hasOwnProperty(item))) {
            CurrencyOps.CreateCurrency(req.body.Name, req.body.Symbol).then( NewCurrency => {
                res.status(201).send(`Created currency ${NewCurrency.CurrencyName} with a stockpile of ${NewCurrency.CurrencySymbol}${NewCurrency.CurrencyTotalStockpile}`)
            })
        }
        else {
            res.status(400).send('Bad request: Incomplete body')
        }
    }

    ProtectRoute(RoutePermissions, req, res, RouteOperation)
})

router.get('/:CurrencyID', (req, res) => {
    CurrencyOps.ReadOneCurrency(req.params.CurrencyID).then(thisCurrency => {
        if (thisCurrency) {
            res.status(200).send(MapCurrency(thisCurrency))
        }
        else {
            res.status(404).send('Not Found: No currency with that ID')
        }
    })
})

router.put('/:CurrencyID', (req, res) => {
    const RoutePermissions = [AppOps.PermissionTypes.CanChangeCurrencyMeta]

    const RouteOperation = () => {
        const RequiredFields = ['Name', 'Symbol']
        if (RequiredFields.every( item => req.body.hasOwnProperty(item))) {
            CurrencyOps.ReadOneCurrency(req.params.CurrencyID).then(thisCurrency => {
                if (thisCurrency) {
                    thisCurrency.CurrencyName = req.body.Name
                    thisCurrency.CurrencySymbol = req.body.Symbol
                    thisCurrency.save()
                    res.status(200).send(`OK: Currency is now named ${thisCurrency.CurrencyName} with the symbol ${thisCurrency.CurrencySymbol}`)
                }
                else {
                    res.status(404).send('Not found: No currency at that ID')
                }
            })
        }
        else {
            res.status(400).send('Bad request: Incomplete body')
        }
    }

    ProtectRoute(RoutePermissions, req, res, RouteOperation)
})

router.delete('/:CurrencyID', (req, res) => {
    const RequiredPermissions = [AppOps.PermissionTypes.CanDeleteCurrency]
    
    const RouteOperation = () => {
        Currency.Model.deleteOne({_id: req.params.CurrencyID}, (err, MongoResponse) => {
            if (err) res.status(500).send(err)
            else {
                res.status(200).send('OK: Data deleted')
            }
        })
    }
    
    ProtectRoute(RequiredPermissions, req, res, RouteOperation)
})

router.put('/:CurrencyID/mint', (req, res) => {
    const RequiredPermissions = [AppOps.PermissionTypes.CanMintCurrency]

    const RouteOperation = () => {
        if (req.query.hasOwnProperty('amount')) {
            if (!isNaN(parseInt(req.query.amount)) && (parseInt(req.query.amount) >= 0)) {
                CurrencyOps.ReadOneCurrency(req.params.CurrencyID).then( thisCurrency => {
                    if (thisCurrency) {
                        thisCurrency.CurrencyRemainingStockpile += parseInt(req.query.amount)
                        thisCurrency.CurrencyTotalStockpile += parseInt(req.query.amount)
                        thisCurrency.save()
                        res.status(200).send(thisCurrency)
                    }
                    else {
                        res.status(404).send(`Not found: Currency ID ${req.params.CurrencyID} does not exist`)
                    }
                })
            }
            else {
                res.status(400).send('Bad request: \'amount\' must be a positive, non-zero number')
            }
        }
        else {
            res.status(400).send('Bad request: No amount specified in query')
        }
    }

    ProtectRoute(RequiredPermissions, req, res, RouteOperation)
})

router.delete('/:CurrencyID/mint', (req, res) => {
    const RequiredPermissions = [AppOps.PermissionTypes.CanDestroyCurrency]

    const RouteOperation = () => {
        if (req.query.hasOwnProperty('amount')) {
            if (!isNaN(parseInt(req.query.amount)) && (parseInt(req.query.amount) >= 0)) {
                CurrencyOps.ReadOneCurrency(req.params.CurrencyID).then( thisCurrency => {
                    if (thisCurrency) {
                        thisCurrency.CurrencyRemainingStockpile -= parseInt(req.query.amount)
                        thisCurrency.CurrencyTotalStockpile -= parseInt(req.query.amount)
                        thisCurrency.save()
                        res.status(200).send(thisCurrency)
                    }
                    else {
                        res.status(404).send(`Not found: Currency ID ${req.params.CurrencyID} does not exist`)
                    }
                })
            }
            else {
                res.status(400).send('Bad request: \'amount\' must be a positive, non-zero number')
            }
        }
        else {
            res.status(400).send('Bad request: No amount specified in query')
        }
    }

    ProtectRoute(RequiredPermissions, req, res, RouteOperation)
})

module.exports = router