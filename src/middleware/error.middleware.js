function errorMiddleware(error, req, res, next){
    let { status = 500, message, data } = error;

    console.log(`[Error] ${error}`);

    //if status is 500 change the message to internal srver error
    message = status === 500 || !message ? 'Internal server error' : message;

    error = {
        type: 'error',
        status,
        message, 
        ...(data) && data
    }

    res.status(status).send(error);
}

module.exports = errorMiddleware;

/**
 * this middle is going to return an object of kind like this below
 *  {
 *      type: 'error',
 *       status: 404,
        message: Not found
        data: optional
 *  }
 */