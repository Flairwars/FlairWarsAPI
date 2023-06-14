const AppOps = require('../db/operations/application')

module.exports.PullAppInfo = (ApplicationSecret, cb) => {
    // This function gets an application from the database and returns it in a callback, if it is found.
    // If the application does not exist, null is returned instead
    AppOps.ReadBySecret(ApplicationSecret).then( thisApp => {
        if (thisApp) cb(thisApp)
        else cb(null)
    })
}

module.exports.AuthGate = (RouteReqPerms, AppPerms, cb) => {
    // This function returns true in the callback if all the perm are present, otherwise returns false
    let evalPerms = (Required, Has) => { return (Required.every(element => Has.includes(element)) || Has.includes('All')) }

    cb(evalPerms(RouteReqPerms, AppPerms))
}

module.exports.AuthCheck = (RequestHeaders) => {
    // This function will recieve the Headers from a request, and then returns the secret in a callback if it is
    // formatted correctly, otherwise returns null

    if (RequestHeaders.hasOwnProperty('authorization')) {
        let AuthHeader = RequestHeaders.authorization
        let AuthType = AuthHeader.split(' ')[0]
        let Secret = AuthHeader.split(' ')[1]
        let Credentials = Buffer.from(Secret, 'base64').toString('ascii')
        if (AuthType === 'Basic') {
            return Secret
        }
        else {
            return null
        }
    }
    else {
        return null
    }
}