
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
updateMysplBatch
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

// 新增时对空数据进行赋默认值
const userParams=(params)=>{
    const defaultParams={
        id:null,
        isDelete:'0',
        uuid:createUuid()
    }
    return Object.assign({...defaultParams},params)
}

//=>获取系统列表信息
route.get('/system_list', (req, res) => {
    const systemObj = {
        build_platform: '发布平台前端',
        build_platform_node:"发布平台node后端",
        management_system_node:'权限管理平台前端',
        ymn_management_system_admin:'权限管理平台node后端'
    }
    const isProd = !process.argv.includes('--dev')
    if(!isProd){
        res.send(success(true, {msg: 'Ok',data:Object.keys(systemObj).map(item=>({label:item,value:systemObj[item]}))}));
        return 
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

//=>增加api信息
route.post('/add', (req, res) => {
    const params =userParams({...req.body,operatingor:req.query.userNames})
	const userAddSql = addMyspl({name:'USER_ROLE_API',params})
    mysqlConnection({querySql:userAddSql,res}).then(({result})=>{
        res.send(success(true, {msg: 'Ok'}));
    })
});

//=>获取api详细信息
route.get('/info', (req, res) => {
    const {uuid} =req.query||{};
    const params = {
	    name:"USER_ROLE_API",
	    params:{uuid}
	}
	const getUserInfoSql = queryMyspl(params) // 编译转换为SQL指令
    mysqlConnection({querySql:getUserInfoSql,res})
    .then(({result})=>{
        res.send(success(true, {
            msg: 'Ok',
            data:result[0]
        }));
    })
});

//=>修改api信息
route.post('/update', (req, res) => {
	const {uuid} =req.body||{};
	const params = {
        name:'USER_ROLE_API',
        params:{
            ...req.body,
            operatingor:req.query.userNames,
        },
        primaryKey:{key:'uuid',value:uuid}
    }
	const updateUserSql = updateMyspl(params)
    mysqlConnection({querySql:updateUserSql,res})
    .then(({result})=>{
        res.send(success(true, {msg: 'Ok'}));
    })
});
//=>批量修改api信息
route.post('/batch_edit', (req, res) => {
	const {ids,isEnable} =req.body||{};
    let param = ids.map(item=>({
        id:item,
        isEnable,
        operatingor:req.query.userNames || ''
    }))
	const params = {
        name:"USER_ROLE_API",
        key:'id',
        params:param
    }
	const updateUserSql = updateMysplBatch(params)
    mysqlConnection({querySql:updateUserSql,res})
    .then(({result})=>{
        res.send(success(true, {msg: 'Ok'}));
    })
});

//=>删除api信息
route.get('/delete', (req, res) => {
    const {uuid} = req.query
    const params = {
        name:'USER_ROLE_API',
        params:{isDelete:"1"},
        primaryKey:{key:"uuid",value:uuid}
    }
	const delUserSql=updateMyspl(params) 
    mysqlConnection({querySql:delUserSql,res})
    .then(({result})=>{
        res.send(success(true,{msg: 'Ok'}));
    })
});
module.exports = route;