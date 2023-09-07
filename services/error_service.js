function handleInvalidJson(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ message: err.message });
    }
    next(err);
}

// Middleware function to handle unauthorized errors
function handleUnauthorized(err, req, res, next) {
    if (err.status === 401) {
        return res.status(401).send({ message: err.message });
    }
    next(err);
}

// Middleware function to handle not found errors
function handleNotFound(err, req, res, next) {
    if (err.status == 404) {
        return res.status(404).send({ message: err.message });
    }
    next(err);
}

// Middleware function to handle all other errors
function handleAllOtherErrors(err, req, res, next) {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message:
                err.message ||
                'Could not process your request, Please try after some time',
        },
    });
}

module.exports = { handleInvalidJson, handleUnauthorized, handleNotFound, handleAllOtherErrors }
