const ErrorMiddleware = (req, res, next) => {
    res.status(500).json({
        error : 'Error to connection!',
        message : 'Invalid URL!'
    })
}

module.exports = ErrorMiddleware