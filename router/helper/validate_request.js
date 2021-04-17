module.exports = validateRequest;

function validateRequest(req, res, next, schema) {
    console.log('hai');
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const {
        error,
        value
    } = schema.validate(req.body, options);
    if (error) {

        res.json({
            status: 0,
            message: "Validation error",
            error: `Validation error: ${error.details.map(x => x.message).join(', ')}`,
        });

    } else {
        req.body = value;
        next();
    }
}