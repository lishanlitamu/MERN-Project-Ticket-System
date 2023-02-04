const errorHandler = (err, req, res, next) => {
    // if there's a statusCode then use it otherwise use 500
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode) // set status to statusCode
    // req.body is information you wanna post to the server when using POST
    // res.json is json format data that you wanna respond to Postman when a request is made
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}


module.exports = {errorHandler}