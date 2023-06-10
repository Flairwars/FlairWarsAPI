/**
 * This file will handle hashing passwords and comparing passwords/keys to hashes
 */

const bcrypt = require('bcrypt')

module.exports.hash = (hashThis, cb) => {
    bcrypt.hash(hashThis, 13, (err, hash) => {
        if (err) {
            console.error(err)
            cb('HASHERR')
        }
        else {
            cb(hash)
        }
    })
}

module.exports.compare = (compareThis, hash, cb) => {
    bcrypt.compare(compareThis, hash, (err, res) => {
        if (err) {
            cb('COMPAREERR')
        }
        else if (res) {
            cb(true)
        }
        else {
            cb(false)
        }
    })
}