const { default: axios } = require("axios");
const request = require("request");
const {
	writeFile,
	readFile,
} = require('./promiseFS');

function getIPtoAddress(ip,res) {
    console.log(`http://ip.360.cn/IPQuery/ipquery?ip=${ip}`);
    axios.get(`http://ip.360.cn/IPQuery/ipquery?ip=${ip}`).then(ress=>{
        console.log(res.data);
    })
};
module.exports = getIPtoAddress