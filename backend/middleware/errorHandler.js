const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    if (err.name === 'CastError') {
        error.statusCode = 404;
        error.message = `Resource not found with id of ${err.value}`;
    }

    if (err.code === 11000) {
        error.statusCode = 400;
        error.message = 'Duplicate field value entered';
    }

    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = Object.values(err.errors).map(val => val.message);
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
