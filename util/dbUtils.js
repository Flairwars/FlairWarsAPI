/**
 * This file contains functions that help with database functionality
 */

/**
 * This function will create a status and response message for database functions
 * @param {String} method The HTTP method used, all capitalized
 * @param {*} dbStatus The content from a database function's callback
 * @returns {Object} An object with status (The HTTP status for the operation) and message (response message)
 */

module.exports.dbStatusHandler = (method, dbStatus) => {
    switch(method) {
        case 'POST':
            if (dbStatus === 'DBERR') return {
                status: 500,
                message: 'Server Error: Database Error'
            }
            else if (dbStatus === 'NOTFOUND') return {
                status: 404,
                message: 'Not Found: Resource not found'
            }
            else return {
                status: 201,
                message: dbStatus
            }
            
        
        case 'GET':
            if (dbStatus === 'DBERR') return {
                status: 500,
                message: 'Server Error: Database Error'
            }
            else if (dbStatus === 'NOTFOUND') return {
                status: 404,
                message: 'Not Found: Resource not found'
            }
            else return {
                status: 200,
                message: dbStatus
            }
        case 'PUT':
            if (dbStatus === 'DBERR') return {
                status: 500,
                message: 'Server Error: Database Error'
            }
            else if (dbStatus === 'NOTFOUND') return {
                status: 404,
                message: 'Not Found: Resource not found'
            }
            else return {
                status: 200,
                message: dbStatus
            }


        case 'DELETE':
            if (dbStatus === 'DBERR') return {
                status: 500,
                message: 'Server Error: Database Error'
            }
            else if (dbStatus === 'NOTFOUND') return {
                status: 404,
                message: 'Not Found: Resource not found'
            }
            else if (dbStatus === 'NOCONTENT') return {
                status: 204,
                message: 'No Content: Delete operation succeeded'
            }
            else return {
                status: 204,
                message: 'No Content: Delete operation succeeded (Legacy)'
            }
        
        default:
            if (dbStatus === 'DBERR') return {
                status: 500,
                message: 'Server Error: Database Error'
            }
            else if (dbStatus === 'NOTFOUND') return {
                status: 404,
                message: 'Not Found: Resource not found'
            }
            else return {
                status: 200,
                message: 'OK'
            }
    }
}

/**
 * This function is just to help reduce repeated code - should only be used with the above
 * function and with the 'res' object within a route handler
 * @param {Object} statusObject Status object from the dbStatusHandler() function
 * @param {Object} routeRes res from a route handler
 */

module.exports.SendResponse = (statusObject, routeRes) => {
    routeRes.status(statusObject.status).send(statusObject.message)
}