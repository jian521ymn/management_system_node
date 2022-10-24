//引入相关资源包
var fs = require("fs");
var path = require("path");
var dirname = path.resolve();
var request = require("request");


/**
 * 
 * @param {*} url  网络文件url地址
 * @param {*} fileName 	文件名
 * @param {*} dir 下载到的目录
 */
function getfileByUrl({ url, fileName, dir }) {
    console.log('------------------------------------------------')
    console.log(url)
    console.log(fileName)
    console.log(dir)
    return new Promise((res, rej) => {
        try {
            console.log(`/www/file/node/${fileName}`, '2222')
            var data = fs.existsSync(`/www/file/node/${fileName}`)
            if (data) {
                res({ code: 0, data: `http://114.215.183.5:88/node/${fileName}` })
                return
            }
            let stream = fs.createWriteStream(path.join(dir, fileName));
            request(url).pipe(stream).on("close", function (err) {
                if (err) {
                    rej({ code: 1, msg: "下载失败" })
                } else {
                    res({ code: 0, data: `http://114.215.183.5:88/node/${fileName}` })
                }
                console.log("文件" + fileName + "下载完毕");
            });
        } catch (error) {
            console('无缓存，下载')

        }
    })
};

/**
 * 
 * @param {*} fileName 	文件名
 */
function getfileProgress({ fileName }) {
    const path_ = `/www/file/node//${fileName}`
    return new Promise((res, rej) => {
            try {
                var data = fs.readFileSync(path_);
                res({code:0,data:data.length})
            } catch (error) {
                res({code:1,data:'读取失败'})
            }
    })
};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


module.exports = { getfileByUrl, getfileProgress }
