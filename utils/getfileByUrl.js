//引入相关资源包
var fs = require("fs");
var path = require("path");
var request = require("request");
/**
 * 
 * @param {*} url  网络文件url地址
 * @param {*} fileName 	文件名
 * @param {*} dir 下载到的目录
 */
function getfileByUrl({url,fileName,dir}){
        console.log('------------------------------------------------')
        console.log(url)
        console.log(fileName)
        console.log(dir)
        let stream = fs.createWriteStream(path.join(dir, fileName));
        return new Promise((res,rej)=>{
            try {
                console.log(`/www/file/node/${fileName}`,'2222')
                var data=fs.existsSync(`/www/file/node/${fileName}`)
                if(data){
                    res({code:0,data:`http://114.215.183.5:88/node/${fileName}`})
                    return
                }
                request(url).pipe(stream).on("close", function (err) {
                    if(err){
                        rej({code:1,msg:"下载失败"})
                    }else{
                        res({code:0,data:`http://114.215.183.5:88/node/${fileName}`})
                    }
                    console.log("文件" + fileName + "下载完毕");
                });
            } catch (error) {
                console('无缓存，下载')
                
            }
        })
};
module.exports={getfileByUrl}