const responseHandler = (req, res, next) => {
    res.success = (status = 200, data = "OK", message = "Successful request") => {
        return res.status(status).json({ success: true, data, message });
    };
    res.fail = (status = 500, code = "INTERNAL_ERROR", message = "Something went wrong") => {
        return res.status(status).json({ success: false, code, message });
    };
    next();
};
export default responseHandler;
//# sourceMappingURL=responseHandler.js.map