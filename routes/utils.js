exports.validateSession = (session) => {
    return new Promise((resolve, reject) => {
        if (!session.user) {
            reject('invalid session')
        } else {
            resolve()
        }
    })
}

exports.validateAuthorised = (userId, session) => {
    return new Promise((resolve, reject) => {
        if (userId != session.user) {
            reject('not authorised')
        } else {
            resolve()
        }
    })
}
