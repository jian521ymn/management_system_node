
const express = require('express'),
 fs = require('fs')
route = express.Router(),
path = require('path'),
svgCaptcha = require('svg-captcha'),
mysql = require("mysql"),
mysqlConnection = require('../../mysql/mysql'),
md5 = require('md5'),
dayjs = require("dayjs")
const {
handleMD5,
success,
getDepartInfo,
getJobInfo,
getUserInfo,
} = require('../../utils/tools');
const {
updateMyspl,
queryMyspl,
addMyspl,
} = require('../../utils/operationMysql')
const {
writeFile,
readFile,
} = require('../../utils/promiseFS');
const { createUuid } = require('../../utils/createUuid')
const xlsxParsing = require('../../utils/xlsxParsing'); //xlsx转换包
const {imgProxyAxios} = require('../../utils/imgProxyAxios')
const { fileBufferPromise } = require('../../utils/fileBufferPromise');
const { getCookie } = require('../../utils/getCookie');

//=>删除用户信息
route.get('/system_list', (req, res) => {
    const files = fs.readdirSync('/www/code').map(item=>({label:item,value:item}))
    res.send(success(true, {msg: 'Ok',data:files}));
});




module.exports = route;