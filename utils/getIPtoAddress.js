const {
    default: axios
} = require("axios");
const request = require("request");
var keyStr = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

function native2ascii(strNative) {
    var output = "";
    for (var i = 0; i < strNative.length; i++) {
        var c = strNative.charAt(i);
        var cc = strNative.charCodeAt(i);
        if (cc > 0xff)
            output += "\\u" + toHex(cc >> 8) + toHex(cc & 0xff);
        else
            output += c;
    }
    return output;
}

var hexChars = "0123456789ABCDEF";

function toHex(n) {
    var nH = (n >> 4) & 0x0f;
    var nL = n & 0x0f;
    return hexChars.charAt(nH) + hexChars.charAt(nL);
}

function ascii2native(strAscii) {
    var output = "";
    var posFrom = 0;
    var posTo = strAscii.indexOf("\\u", posFrom);
    while (posTo >= 0) {
        output += strAscii.substring(posFrom, posTo);
        output += toChar(strAscii.substr(posTo, 6));
        posFrom = posTo + 6;
        posTo = strAscii.indexOf("\\u", posFrom);
    }
    output += strAscii.substr(posFrom);
    return output;
}

function toChar(str) {
    if (str.substr(0, 2) != "\\u") return str;

    var code = 0;
    for (var i = 2; i < str.length; i++) {
        var cc = str.charCodeAt(i);
        if (cc >= 0x30 && cc <= 0x39)
            cc = cc - 0x30;
        else if (cc >= 0x41 && cc <= 0x5A)
            cc = cc - 0x41 + 10;
        else if (cc >= 0x61 && cc <= 0x7A)
            cc = cc - 0x61 + 10;

        code <<= 4;
        code += cc;
    }

    if (code < 0xff) return str;

    return String.fromCharCode(code);
}

function getIPtoAddress(ip) {
    console.log(ip);
    return new Promise(function (resolve, reject) {
        axios.get(`https://restapi.amap.com/v3/ip?ip=${ip}&key=dfb837981bc384dee39275546f47a118`).then(ress => {
            const {province,city} = ress.data;
            resolve(`${province}${city}`)
        }).catch(()=>{
            resolve('未知地区')
        })
    })
};
module.exports = getIPtoAddress