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

// 新增时对空数据进行赋默认值
const userParams=(params)=>{
    const defaultParams={
        id:null,
        name:params.phone,
        password:'123456',
        sex:'1',
        email:'',
        phone:'',
        token:'',
        address:'',
        captcha:'',
        tokenTime:dayjs().format("YYYY-MM-DD HH:mm:ss"),
        userName:'', 
        operatingTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        operatingor: '',
        isDelete:'0',
        roles:'',
        uuid:createUuid()
    }
    return Object.assign({...defaultParams},params)
}
// 新增及其列表返回数据过滤
const dateFilter=(item)=>{
    const {id,name,sex,email,phone,address,tokenTime,userName,operatingTime,operatingor,uuid, roles}=item||{};
    return {
        id,
        name,
        sex,
        email,
        phone,
        address,
        tokenTime,
        userName,
        operatingTime,
        operatingor,
        uuid,
        roles,
    }
}



//=>用户登录
route.post('/login', (req, res) => {
    let md5Str = '',userNames, imageUrls
	let {userName:name, password = '', authCode = ''} = req.body || {};
	const loginQuerySql = queryMyspl( {name:"USER",params:{name,password,isDelete:"0"}}); // 编译转换为SQL指令
    mysqlConnection({querySql:loginQuerySql,res,isCheckSso:false})
    .then(({result})=>{
        const {id, userName, imageUrl} = result[0] || {};
        imageUrls=imageUrl
        userNames=userName
        if(result.length>0) {
            md5Str = md5(`${password+name+new Date()*1}`) // md5处理加密
            const params = {
                name:'USER',
                params:{token:md5Str,tokenTime:dayjs().format("YYYY-MM-DD HH:mm:ss")},
                primaryKey:{key:'id',value:id}
            }
    		const setTokenSql=updateMyspl(params) 
    		return mysqlConnection({querySql:setTokenSql,res, isCheckSso:false}) //链式调用
        }else{
            res.send(success(false, {msg: '用户名或密码错误!'}));
        }
    })
    .then(({result})=>{
        res.setHeader('Set-Cookie',`token=${md5Str}`);
        res.send(success(true, {
            data:{
                userNames,
                token:md5Str,
                imageUrl:imageUrls,
                power: req.session.power,
            }
        })) 
    })
});

//=>检测是否登录
const maxTime = 24*60*60*1000 // 秘钥失效时间
route.get('/login', (req, res) => {
	let token = req.query?.token || getCookie(req)?.token
    const {path='', type:parentId} =req.query || {};
    let roles =''
	if(!token){
	    errorRes()
	    return
	}
	// 编译转换为SQL指令
	const loginQuerySql = queryMyspl({
        name:"USER",
        params:{token,isDelete:"0"}
	})
    mysqlConnection({querySql:loginQuerySql,res, isCheckSso:false})
    .then(({result})=>{
        const {tokenTime, token:sqlToken, userName, roles:rolelist} =result[0] || {};
        const tokenStartTime = dayjs(tokenTime).valueOf() // 获取当前时间戳
        // 没查到数据 && 超出时间戳限制时间 && token是否与数据库内一致
        if(result.length !== 0 && dayjs().valueOf()-tokenStartTime < maxTime && sqlToken === token){
            roles=rolelist.split(",");
            return mysqlConnection({
                querySql:queryMyspl({
                    name:"USER_ROLE_API",
                    params:{
                        token,
                        isDelete:"0",
                        path,
                        parentId
                    }
                }),
            res})
        }
        res.send(success(true, {msg: 'Ok',data:{msg: '请重新登录!',code:999}}));
        return Promise.reject('isSend');
    })
    .then(({result})=>{
        if(Array.isArray(result) && result.length === 0){
            return Promise.reject();
        }
        const { uuid } = result[0] || {};
        return mysqlConnection({
            querySql:queryMyspl({
                name:"USER_ROLE",
                params:{
                    uuid,
                    token,
                    isDelete:"0",
                }
            }),
        res})
    })
    .then(({result})=>{
        if(Array.isArray(result) && result.length === 0){
            return Promise.reject();
        }
        const {id} = result[0] || {};
        if(roles == id) {
            res.send(success(true,{msg: 'Ok',data:{msg: 'Ok',code:0,token, userNames:userName}}));
        }else{
            Promise.reject()
        }
    }).catch((isSend)=>{
        console.log(isSend,'issend');
        if(isSend) return;
        res.send(success(true, {msg: 'Ok',data:{msg: '暂无权限!',code:1}}));
    })

});

//=>上传文件并解析
route.post('/import', async (req, res) => {
    const { buffer, totalLength } = await fileBufferPromise(req) // 获得arrayBuffer，及其长度。
    try {
        const data = xlsxParsing(Buffer.concat(buffer,totalLength)) // 调用xlsx方法去处理表格
        data.list =(data.list || []).map(item=>{
           // 表格男女输入的都是汉字，所以需要这里map下
           const [userName,sex,email,phone,address]=item;
           return {userName,sex:sex==='男'?'1':'0',email,phone,address}
        })
        res.send(success(true,{data}));
    } catch (err) {
        res.send(success(false,{msg:'未知错误'}))
    }
	
});

//=>获取验证码
route.get('/getauthcode', (req, res) => {
    let {type = 'svg'} = req.query || {};
    var codeConfig = {
        size: 6,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 6, // 干扰线条的数量
        height: 35 // 干扰线的高度
    }
    const basePath = path.resolve() // 获取文件路径
    const filePath =path.resolve(basePath, 'test.svg')
    var captcha = svgCaptcha.create(codeConfig);
    var data = {
        svg:captcha.data,
        text: captcha.text.toLowerCase()
    }
    res.send(success(true, {data}));
});

//=>获取验证码
route.get('/getauthcode1', (req, res) => {
    let {type = 'svg'} = req.query || {};
    var codeConfig = {
        size: 6,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 6, // 干扰线条的数量
        height: 35 // 干扰线的高度
    }
    const basePath = path.resolve() // 获取文件路径
    const filePath =path.resolve(basePath, 'test.SVG')
    var captcha = svgCaptcha.create(codeConfig);
    var data = {
        svg:captcha.data,
        text: captcha.text.toLowerCase()
    }
    writeFile(filePath,captcha.data)
    .then(result=>{
        readFile(filePath).then(result1=>{
        const svgToBase64="data:image/svg+xml;base64,"+result1.toString("base64")
        res.send(success(true, {data:{...data,svg:svgToBase64}}));
    })
    }).catch(e=>res.send(success(false,{msg:"验证码生成失败"})))
});

//=>获取用户列表
route.get('/list', (req, res) => {
    const {pageNum=1,pageSize=10, roleName:roles, name} =req.query;
    const params = {
	    name:"USER",
	    params:{
            isDelete:"0",
            userName: `%${name || ''}`,
            roles:  `%${roles || ''}`
        },
	    page:`${pageSize*(pageNum-1)},${pageSize*pageNum}`,
	    like:"LIKE",
	    sort:{id:"DESC"}
	}
	const loginQuerySql = queryMyspl(params) // 编译转换为SQL指令
    mysqlConnection({querySql:loginQuerySql,res,isSearchList:true, isCheckSso:false})
    .then(({result,total})=>{
        const list = result.map(item=>dateFilter(item)) // 调用统一的用户信息map函数
        res.send(success(true, {
            data:{
                total,
                list:list,
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

//=>删除用户信息
route.get('/delete', (req, res) => {
    const {uuid} = req.query
    const params = {
        name:'USER',
        params:{isDelete:"1"},
        primaryKey:{key:"uuid",value:uuid}
    }
	const delUserSql=updateMyspl(params) 
    mysqlConnection({querySql:delUserSql,res})
    .then(({result})=>{
        res.send(success(true,{msg: 'Ok'}));
    })
});
// => 头像修改新增
route.post('/img', async (req, res) => {
    const {token, type} = req.query;
    const { buffer, totalLength } = await fileBufferPromise(req) // 获得arrayBuffer，及其长度。
	const getUserInfoSql = queryMyspl({name:"USER", params:{token}}) // 编译转换为SQL指令
    mysqlConnection({querySql:getUserInfoSql,res})
    .then(({result})=>{
        const {uuid:fileName} =dateFilter(result[0]);
        const bufferConcat = Buffer.concat([...buffer], totalLength); // 拼接完整buffer，发给服务器
        return imgProxyAxios({fileName,type,buffer:bufferConcat}) // 链式调用，图片服务器存储并返回路径。
    }).then(resultDate=>{
        const {code,msg,data:{url}} = resultDate.data || {};
        // 图片服务如果挂掉直接抛出异常
        if(code !== 0) {
            res.send(success(false,{msg:msg}))
            return
        }
        // 图片服务完成时，将图片远程地址，写入目标数据库。
        const params = {
            name:'USER',
            params:{imageUrl: url},
            primaryKey:{key:'token',value:token}
        }
    	const updateUserSql = updateMyspl(params)
        mysqlConnection({querySql:updateUserSql,res})
        .then(({result})=>{
            res.send(success(true, {msg: 'Ok',data:{url}}));
        })
    }).catch(e=>res.send(success(false,{msg:'未知异常'})))
});
//=>获取积分信息
route.get('/team_list', (req, res) => {
	const params = {
        name:'TEAM',
        params:{isDelete:0},
    }
	const updateUserSql = queryMyspl(params)
    mysqlConnection({querySql:updateUserSql,res})
    .then(({result})=>{
        res.send(success(true, {data:result,msg: 'Ok'}));
    })
});
//=>获取积分信息
route.get('/team_update', (req, res) => {
    const {num,id} =req.query || {};
	const params = {
        name:'TEAM',
        params:{num},
        primaryKey:{key:'id',value:id}
    }
	const updateUserSql = updateMyspl(params)
    mysqlConnection({querySql:updateUserSql,res})
    .then(({result})=>{
        res.send(success(true, {data:{},msg: 'Ok'}));
    })
});
module.exports = route;