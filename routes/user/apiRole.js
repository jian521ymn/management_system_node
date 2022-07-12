
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
    const systemObj = {
        build_platform: '发布平台前端',
        build_platform_node:"发布平台node后端",
        management_system_node:'权限管理平台前端',
        ymn_management_system_admin:'权限管理平台node后端'
    }
    const files = fs.readdirSync('/www/code').filter(item=>item !== 'jian_ymn_node').map(item=>({label:item,value:systemObj[item]}))
    res.send(success(true, {msg: 'Ok',data:files}));
});
//=>获取api列表
route.get('/list', (req, res) => {
    const {pageNum=1,pageSize=10, systemKey=''} =req.query;
    const params = {
	    name:"USER_ROLE_API",
	    params:{
            isDelete:"0",
            parentId:`%${systemKey}`,
        },
	    page:`${pageSize*(pageNum-1)},${pageSize*pageNum}`,
	    like:"LIKE",
	    sort:{id:"DESC"}
	}
	const loginQuerySql = queryMyspl(params) // 编译转换为SQL指令
    mysqlConnection({querySql:loginQuerySql,res,isSearchList:true})
    .then(({result,total})=>{
        res.send(success(true, {
            data:{
                total,
                list:result,
                pageNum:Number(pageNum),
                pageSize:Number(pageSize),
            }
        }));
    })
});




module.exports = route;