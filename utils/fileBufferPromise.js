
const iconv = require('iconv-lite')
// 处理buffer·流
function fileBufferPromise (req) {
    return new Promise ((resolve,reject)=>{
        let allBuffer = [],totalLength = 0
        try {
         req.on("data",function(dt){
            allBuffer.push(dt)
            totalLength+= dt.length;
         })
         req.on("end",function(dt){
            resolve({code:0,buffer:allBuffer, totalLength})
         })
        } catch (e) {
            resolve({code:1,msg:e})
        }
    })
}
exports.fileBufferPromise=fileBufferPromise