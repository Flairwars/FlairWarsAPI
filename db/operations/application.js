/**
 * Application Operations
 * Permissions:
 * 
 * CanWriteUsers - This application can create users
 * CanUpdateUsers - This application can update user info
 * CanDeleteUsers - This application can delete users
 * CanManageAppPerms - This application can update app permissions for other applications
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
    CanManageAppPerms: 'CanManageAppPerms',
    CanManagePasswords: 'CanManagePasswords', // NOTE: do NOT give this to anything you don't 100% trust! it allows setting passwords with zero checks beyond app perms
    All: 'All'
}

// This function creates an application in the database.
module.exports.RegisterApplication = (AppName) => {
    let NewApplication = new Application.Model({
        AppName: AppName,
        Permissions: []
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
    Application.Model.findOne({AppName: AppName}) .exec( (err, res) => {
        console.log(err)
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