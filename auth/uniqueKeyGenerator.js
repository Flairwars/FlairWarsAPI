/**
 * This file is for ensuring that secret keys are unique. The UUID Algorithm
 * (used from chanceJs, the guid() function) should, practically, always generate
 * a new uniqe id - this function will just double check.
 */

const chance = require('chance')
let Chance = new chance

/**
 * This function gives you a unique key for an object in the database
 * @param {Object} queryModel The model you're generating a key for
 * @param {String} uniqueKeyField The field the key is stored in
 * @param {Function} cb Callback function containing the key
 */

module.exports = (queryModel, uniqueKeyField, cb) => {
    const query = {}

    let keepLooping = true

    while (keepLooping) {
        query[uniqueKeyField] = Chance.guid()

        queryModel.findOne({query}, (err, res) => {
            if (err) {
                console.error(err)
            }
            else if (res) {
                keepLooping = true
            }
            else {
                keepLooping = false
                cb(query[uniqueKeyField])
            }
        })
    }
}