/**
 * Application Operations
 * Permissions:
 * 
 * CanWriteUsers - This application can create users
 * CanUpdateUsers - This application can update user info
 * CanDeleteUsers - This application can delete users
 * CanWriteCurrencies - This application can create currencies
 * CanUpdateCurrency - This application can change currency info (name, symbol)
 * CanMintCurrency - This application can add to the stockpile of a currency
 * CanDestroyCurrency - This application can remove currency from the stockpile
 * CanDeleteCurrency - This application can delete an entire currency
 * CanInteractWithCurrency - This application can withdraw or deposit currency to the Stockpile
 * CanChangeCurrencyMeta - This application can update the name and symbol of a currency
 * 
 * All - This application can do anything
 */

 // The Application Schema file
const Application = require('../schema/application')

// Permission Types create an easy to use format for standardizing permission restrictions
module.exports.PermissionTypes = {
    CanWriteUsers: 'CanWriteUsers', 
    CanUpdateUsers: 'CanUpdateUsers',
    CanDeleteUsers: 'CanDeleteUsers',
    CanWriteCurrencies: 'CanWriteCurrencies',
    CanUpdateCurrency: 'CanUpdateCurrency',
    CanMintCurrency: 'CanMintCurrency',
    CanDestroyCurrency: 'CanDestroyCurrency',
    CanDeleteCurrency: 'CanDeleteCurrency',
    CanManageAppPerms: 'CanManageAppPerms',
    CanInteractWithCurrency: 'CanInteractWithCurrency',
    CanChangeCurrencyMeta: 'CanChangeCurrencyMeta',
    All: 'All'
}

// This function creates an application in the database.
module.exports.RegisterApplication = (AppName) => {
    let NewApplication = new Application.Model({
        AppName: AppName,
        Permissions: [],
        Currencies: []
    })

    return NewApplication.save()
}

// Retrieves an Application from the database using its secret
module.exports.ReadBySecret = async (AppSecret) => {
    return await Application.Model.findById(AppSecret).exec()
}

// Retrieves an Application from the database using its name
module.exports.ReadByName = async (AppName) => {
    return await Application.Model.findOne({AppName: AppName}).exec()
}

// Append Permissions to an application's Permissions array
module.exports.AddPermissions = (AppName, NewPermissions) => {
    Application.Model.findOne({AppName: AppName}).exec( (err, res) => {
        if (err) console.error(err);
        else {
            if (Array.isArray(NewPermissions)) {
                let newPermArray = res.Permissions.concat(NewPermissions)
                res.Permissions = [ ...new Set(newPermArray) ]
                res.save()
            }
            else {
                if (!res.Permissions.includes(NewPermissions)) res.Permissions.push(NewPermissions)
                res.save()
            }
        }
    })
}

// Remove Permissions from an application's Permissions array
module.exports.RemovePermissions = (AppName, PermsToRemove) => {
    Application.Model.findOne({AppName: AppName}).exec( (err, res) => {
        if (err) console.error(err);
        else {
            if (Array.isArray(PermsToRemove)) {
                PermsToRemove.forEach( permission => {
                    if (res.Permissions.includes(permission)) {
                        res.Permissions.splice(res.Permissions.indexOf(permission), 1)
                    }
                })
                res.save()
            }
            else {
                if (res.Permissions.includes(PermsToRemove)) {
                    res.Permissions.splice(res.Permissions.indexOf(PermsToRemove), 1)
                }
                res.save()
            }
        }
    })
}

// Add a currency to this application's managed currencies array
module.exports.AddCurrency = (CurrencyID, ApplicationID) => {
    Application.Model.findById(ApplicationID).exec( (err, res) => {
        if (err) console.error(err);
        else {
            res.Currencies.push(CurrencyID)
            res.save()
        }
    })
}

// Remove a currency to from application's managed currencies array
module.exports.RemoveCurrency = (CurrencyID, ApplicationID) => {
    Application.Model.findById(ApplicationID).exec( (err, res) => {
        if (err) console.error(err);
        else {
            if(res.Currencies.includes(CurrencyID)) {
                res.Currencies = res.Currencies.splice(indexOf(CurrencyID), 1)
                res.save()
            }
        }
    })
}