function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return {
        ip,
        userAgent:req.headers['user-agent'],
        time:new Date()*1
    }
};
module.exports = getClientIp