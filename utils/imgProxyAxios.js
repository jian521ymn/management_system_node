
// 调用图片服务地址服务
const axios =require("axios")
const {fileBufferPromise} = require('../utils/fileBufferPromise')

exports.imgProxyAxios = function ({fileName,type,buffer}) {
   return new Promise((resolve,reject)=>{
        axios({
            method: 'post',
            url: `http://114.215.183.5:99/upload/img?fileName=${fileName}&type=${type}`,
            data: buffer,
            headers: { 'Content-Type': 'application/octet-stream'},
            onUploadProgress: () => {},
        }).then(res=>{
            resolve(res)
        }).catch(e=>{
            resolve({code:1, msg:'错误兜底'+e,data:{}})
        })  
   })
}