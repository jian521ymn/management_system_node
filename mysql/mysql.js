

// 数据库操作
var mysql = require("mysql")
const {
	handleMD5,
	success,
	getDepartInfo,
	getJobInfo,
	getUserInfo,
} = require('../utils/tools');
const { queryMyspl } =require('../utils/operationMysql')
async function mysqlConnection (params) {
    const {querySql,res,isSearchList, checkParams, isCheckSso = true} =params;
    // const isProd = res.req.headers.host.includes('114.215.183.5')
    // 和本地数库建立连接
    var connection = mysql.createConnection({
      connectionLimit: 50,
      host: 1 ? 'localhost' : '114.215.183.5', //远程MySQL数据库的ip地址
      user: "jianymn_admin",
      password: "AhAtcEyyjSeSijWE",
      database: "jianymn_admin"
    })
    const {code, msg, result} = await new Promise((resolve,reject)=>{
         // 数据库连接成功回调
        connection.connect(function (err) {
            if (err) {
                console.log("连接错误");
                resolve({code:1,msg:"数据库连接错误"+err,result:[]})
                return;
            }
            resolve({code :0, msg:"OK", result:[]})
        })
    })
    // 数据库连接错误时,将错误报出去
    if(code !== 0) {
        res.send(success(false, {msg}))
        return new Promise((resolve,reject)=>resolve({code,msg,result}))
    }
    // sql 为数组时，进行循环操作每个SQL，并将每个sql的结果缓存住
    if ( Array.isArray(querySql)) {
        let promiseAll =querySql.reduce((ary,next,index)=>{
            let promise =new Promise((resolve,reject)=>{
                  connection.query(checkParams[index],(err1,result1)=>{
                      if(err1 || (result1 && result1.length > 0)){
                          resolve({code:1,index});
                          return
                      }
                       connection.query(next,(err,result)=>{
                            if(err){
                                resolve({code:1,index})
                                return    
                            }
                            resolve({code:0})
                    })
                  })
            }).catch(e=>{reject({code:1,msg:e})})
         ary.push(promise)
         return ary
        },[])
        return Promise.all(promiseAll)
    }
    return new Promise((resolve,reject)=>{
            connection.query(querySql,(err,result)=>{
                if(err){
                    res.send(success(false, {msg: `SQL error: ${err}!`}));
                    reject()
                    return    
                }
                if(isSearchList){
                    connection.query("SELECT FOUND_ROWS()",(err,resultTotal)=>{
                        if(err){
                            res.send(success(false, {msg: `SQL error: ${err}!`}));
                            reject()
                            return    
                        }
                       const total =(resultTotal[0] || {})['FOUND_ROWS()']
                       resolve({result,total})
                    })  
                    return
                }
                resolve({result})
        
                })
            })
    return
}

module.exports = mysqlConnection
