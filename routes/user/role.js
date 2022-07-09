const express = require('express'),
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


//=>获取用户列表
route.get('/list', (req, res) => {
    const {pageNum=1,pageSize=10} =req.query;
    const params = {
	    name:"USER_ROLE",
	    params:{isDelete:"0"},
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

//=>获取用户详细信息
route.get('/info', (req, res) => {
    const {uuid} =req.query||{};
    const params = {
	    name:"USER",
	    params:{uuid}
	}
	const getUserInfoSql = queryMyspl(params) // 编译转换为SQL指令
    mysqlConnection({querySql:getUserInfoSql,res})
    .then(({result})=>{
        res.send(success(true, {
            msg: 'Ok',
            data:dateFilter(result[0])
        }));
    })
});

//=>增加用户信息
route.post('/add', (req, res) => {
    const params =userParams({...req.body,operatingor:req.query.userNames})
	const userAddSql = addMyspl({name:'USER',params})
    mysqlConnection({querySql:userAddSql,res}).then(({result})=>{
        res.send(success(true, {msg: 'Ok'}));
    })
});

//=>批量增加用户信息
route.post('/batchAdd', (req, res) => {
    const phoneAry = []; // 前置查询是否存在
    const batchAddSql =req.body.map(item=>{
       let params = userParams({...item,operatingor:req.query.userNames});
       let phoneSql = queryMyspl({name:"USER",params:{phone:params.phone}}) // 编译转换为SQL指令
       phoneAry.push(phoneSql)
       return addMyspl({name:'USER',params})
    })
    mysqlConnection({querySql:batchAddSql,res,checkParams:phoneAry}).then((result)=>{
        const resultFilter=result.reduce((all,next)=>{
            if(next.code ===1){
                all.push({...req.body[next.index],errorInfo:`手机号：${req.body[next.index].phone}已存在！`})
            }
            return all
        },[])
        res.send(success(true, {msg: 'Ok',data:{list:resultFilter,successTotal:req.body.length-resultFilter.length}}));
    }).catch(e=>{res.send(success(false, {msg: '未知异常'}))})
});

//=>修改用户信息
route.post('/update', (req, res) => {
	const {uuid} =req.body||{};
	const params = {
        name:'USER',
        params:{
            ...req.body,
            operatingor:req.query.userNames,
            operatingTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        },
        primaryKey:{key:'uuid',value:uuid}
    }
	const updateUserSql = updateMyspl(params)
    mysqlConnection({querySql:updateUserSql,res})
    .then(({result})=>{
        res.send(success(true, {msg: 'Ok'}));
    })
});

module.exports = route;