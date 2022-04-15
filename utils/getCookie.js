function getCookie(req) {
    let cookie = req?.headers.cookie;
    if(!cookie){
        return {};
    }
    return cookie.replace(/\s+/g,'').split(';').reduce((prev,next)=>{
        const [key, value] = next.split('=')
        prev[key] = value
        return prev
    },{})
}
module.exports ={getCookie}