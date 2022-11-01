//引入相关资源包
var fs = require("fs");
var path = require("path");
var dirname = path.resolve();
var request = require("request");

const nodeVersion = [
    "19.0.0",
    "18.11.0",
    "18.10.0",
    "18.9.1",
    "18.9.0",
    "18.8.0",
    "18.7.0",
    "18.6.0",
    "18.5.0",
    "18.4.0",
    "18.3.0",
    "18.2.0",
    "18.1.0",
    "18.0.0",
    "17.9.1",
    "17.9.0",
    "17.8.0",
    "17.7.2",
    "17.7.1",
    "17.7.0",
    "17.6.0",
    "17.5.0",
    "17.4.0",
    "17.3.1",
    "17.3.0",
    "17.2.0",
    "17.1.0",
    "17.0.1",
    "17.0.0",
    "16.18.0",
    "16.17.1",
    "16.17.0",
    "16.16.0",
    "16.15.1",
    "16.15.0",
    "16.14.2",
    "16.14.1",
    "16.14.0",
    "16.13.2",
    "16.13.1",
    "16.13.0",
    "16.12.0",
    "16.11.1",
    "16.11.0",
    "16.10.0",
    "16.9.1",
    "16.9.0",
    "16.8.0",
    "16.7.0",
    "16.6.2",
    "16.6.1",
    "16.6.0",
    "16.5.0",
    "16.4.2",
    "16.4.1",
    "16.4.0",
    "16.3.0",
    "16.2.0",
    "16.1.0",
    "16.0.0",
    "15.14.0",
    "15.13.0",
    "15.12.0",
    "15.11.0",
    "15.10.0",
    "15.9.0",
    "15.8.0",
    "15.7.0",
    "15.6.0",
    "15.5.1",
    "15.5.0",
    "15.4.0",
    "15.3.0",
    "15.2.1",
    "15.2.0",
    "15.1.0",
    "15.0.1",
    "15.0.0",
    "14.20.1",
    "14.20.0",
    "14.19.3",
    "14.19.2",
    "14.19.1",
    "14.19.0",
    "14.18.3",
    "14.18.2",
    "14.18.1",
    "14.18.0",
    "14.17.6",
    "14.17.5",
    "14.17.4",
    "14.17.3",
    "14.17.2",
    "14.17.1",
    "14.17.0",
    "14.16.1",
    "14.16.0",
    "14.15.5",
    "14.15.4",
    "14.15.3",
    "14.15.2",
    "14.15.1",
    "14.15.0",
    "14.14.0",
    "14.13.1",
    "14.13.0",
    "14.12.0",
    "14.11.0",
    "14.10.1",
    "14.10.0",
    "14.9.0",
    "14.8.0",
    "14.7.0",
    "14.6.0",
    "14.5.0",
    "14.4.0",
    "14.3.0",
    "14.2.0",
    "14.1.0",
    "14.0.0",
    "13.14.0",
    "13.13.0",
    "13.12.0",
    "13.11.0",
    "13.10.1",
    "13.10.0",
    "13.9.0",
    "13.8.0",
    "13.7.0",
    "13.6.0",
    "13.5.0",
    "13.4.0",
    "13.3.0",
    "13.2.0",
    "13.1.0",
    "13.0.1",
    "13.0.0",
    "12.22.12",
    "12.22.11",
    "12.22.10",
    "12.22.9",
    "12.22.8",
    "12.22.7",
    "12.22.6",
    "12.22.5",
    "12.22.4",
    "12.22.3",
    "12.22.2",
    "12.22.1",
    "12.22.0",
    "12.21.0",
    "12.20.2",
    "12.20.1",
    "12.20.0",
    "12.19.1",
    "12.19.0",
    "12.18.4",
    "12.18.3",
    "12.18.2",
    "12.18.1",
    "12.18.0",
    "12.17.0",
    "12.16.3",
    "12.16.2",
    "12.16.1",
    "12.16.0",
    "12.15.0",
    "12.14.1",
    "12.14.0",
    "12.13.1",
    "12.13.0",
    "12.12.0",
    "12.11.1",
    "12.11.0",
    "12.10.0",
    "12.9.1",
    "12.9.0",
    "12.8.1",
    "12.8.0",
    "12.7.0",
    "12.6.0",
    "12.5.0",
    "12.4.0",
    "12.3.1",
    "12.3.0",
    "12.2.0",
    "12.1.0",
    "12.0.0",
    "11.15.0",
    "11.14.0",
    "11.13.0",
    "11.12.0",
    "11.11.0",
    "11.10.1",
    "11.10.0",
    "11.9.0",
    "11.8.0",
    "11.7.0",
    "11.6.0",
    "11.5.0",
    "11.4.0",
    "11.3.0",
    "11.2.0",
    "11.1.0",
    "11.0.0",
    "10.24.1",
    "10.24.0",
    "10.23.3",
    "10.23.2",
    "10.23.1",
    "10.23.0",
    "10.22.1",
    "10.22.0",
    "10.21.0",
    "10.20.1",
    "10.20.0",
    "10.19.0",
    "10.18.1",
    "10.18.0",
    "10.17.0",
    "10.16.3",
    "10.16.2",
    "10.16.1",
    "10.16.0",
    "10.15.3",
    "10.15.2",
    "10.15.1",
    "10.15.0",
    "10.14.2",
    "10.14.1",
    "10.14.0",
    "10.13.0",
    "10.12.0",
    "10.11.0",
    "10.10.0",
    "10.9.0",
    "10.8.0",
    "10.7.0",
    "10.6.0",
    "10.5.0",
    "10.4.1",
    "10.4.0",
    "10.3.0",
    "10.2.1",
    "10.2.0",
    "10.1.0",
    "10.0.0",
    "9.11.2",
    "9.11.1",
    "9.11.0",
    "9.10.1",
    "9.10.0",
    "9.9.0",
    "9.8.0",
    "9.7.1",
    "9.7.0",
    "9.6.1",
    "9.6.0",
    "9.5.0",
    "9.4.0",
    "9.3.0",
    "9.2.1",
    "9.2.0",
    "9.1.0",
    "9.0.0",
    "8.17.0",
    "8.16.2",
    "8.16.1",
    "8.16.0",
    "8.15.1",
    "8.15.0",
    "8.14.1",
    "8.14.0",
    "8.13.0",
    "8.12.0",
    "8.11.4",
    "8.11.3",
    "8.11.2",
    "8.11.1",
    "8.11.0",
    "8.10.0",
    "8.9.4",
    "8.9.3",
    "8.9.2",
    "8.9.1",
    "8.9.0",
    "8.8.1",
    "8.8.0",
    "8.7.0",
    "8.6.0",
    "8.5.0",
    "8.4.0",
    "8.3.0",
    "8.2.1",
    "8.2.0",
    "8.1.4",
    "8.1.3",
    "8.1.2",
    "8.1.1",
    "8.1.0",
    "8.0.0",
    "7.10.1",
    "7.10.0",
    "7.9.0",
    "7.8.0",
    "7.7.4",
    "7.7.3",
    "7.7.2",
    "7.7.1",
    "7.7.0",
    "7.6.0",
    "7.5.0",
    "7.4.0",
    "7.3.0",
    "7.2.1",
    "7.2.0",
    "7.1.0",
    "7.0.0",
    "6.17.1",
    "6.17.0",
    "6.16.0",
    "6.15.1",
    "6.15.0",
    "6.14.4",
    "6.14.3",
    "6.14.2",
    "6.14.1",
    "6.14.0",
    "6.13.1",
    "6.13.0",
    "6.12.3",
    "6.12.2",
    "6.12.1",
    "6.12.0",
    "6.11.5",
    "6.11.4",
    "6.11.3",
    "6.11.2",
    "6.11.1",
    "6.11.0",
    "6.10.3",
    "6.10.2",
    "6.10.1",
    "6.10.0",
    "6.9.5",
    "6.9.4",
    "6.9.3",
    "6.9.2",
    "6.9.1",
    "6.9.0",
    "6.8.1",
    "6.8.0",
    "6.7.0",
    "6.6.0",
    "6.5.0",
    "6.4.0",
    "6.3.1",
    "6.3.0",
    "6.2.2",
    "6.2.1",
    "6.2.0",
    "6.1.0",
    "6.0.0",
    "5.12.0",
    "5.11.1",
    "5.11.0",
    "5.10.1",
    "5.10.0",
    "5.9.1",
    "5.9.0",
    "5.8.0",
    "5.7.1",
    "5.7.0",
    "5.6.0",
    "5.5.0",
    "5.4.1",
    "5.4.0",
    "5.3.0",
    "5.2.0",
    "5.1.1",
    "5.1.0",
    "5.0.0",
    "4.9.1",
    "4.9.0",
    "4.8.7",
    "4.8.6",
    "4.8.5",
    "4.8.4",
    "4.8.3",
    "4.8.2",
    "4.8.1",
    "4.8.0",
    "4.7.3",
    "4.7.2",
    "4.7.1",
    "4.7.0",
    "4.6.2",
    "4.6.1",
    "4.6.0",
    "4.5.0",
    "4.4.7",
    "4.4.6",
    "4.4.5",
    "4.4.4",
    "4.4.3",
    "4.4.2",
    "4.4.1",
    "4.4.0",
    "4.3.2",
    "4.3.1",
    "4.3.0",
    "4.2.6",
    "4.2.5",
    "4.2.4",
    "4.2.3",
    "4.2.2",
    "4.2.1",
    "4.2.0",
    "4.1.2",
    "4.1.1",
    "4.1.0",
    "4.0.0",
]
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
    const url = `http://114.215.183.5:88/node/${fileName}`
    console.log(22);
    return new Promise((res, rej) => {
        try {
            // console.log(`/www/file/node/${fileName}`,'2222')
            // var data=fs.existsSync(`/www/file/node/${fileName}`)
            // if(!data){
            //     res({code:1,msg:'获取文件异常'})
            //     return
            // }
            // // let stream = fs.createWriteStream(path.join(dir, fileName));
            // request(url).on("data", function (data) {
            //     res({a:response.headers['content-length'], b:data.length})
            // });
            try {
                console.log(path.resolve(dirname, '/utils/1.jpeg'))
                var data = fs.readFileSync(path.join(dirname, '/utils/1.jpeg'));
                let indd = 0;
                let vers = {}
                let pro = () => new Promise(res => {
                    request(`https://nodejs.org/download/release/v${nodeVersion[indd]}/`, (error, response, body) => {
                        let data = formatBody(body);
                        vers[nodeVersion[indd]] = data;
                        indd = indd + 1;
                        if (indd > nodeVersion?.length - 1) {
                            fs.writeFile("output.json", JSON.stringify(vers), function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            return
                        }
                        pro()
                    })
                })
                pro()
                // request('https://nodejs.org/download/release/v16.9.0/', (error, response, body) => {
                //     console.log('error:', error); // Print the error if one occurred
                //     // console.log('statusCode:', response); // Print the response status code if a response was received
                //     // console.log('body:', JSON.stringify(body)); // Print the HTML for the Google homepage.
                //     console.log(formatBody(body));
                //     // res(data)
                // })
                console.log(formatBytes(data.length, 3), 'data');
            } catch (error) {
                console.log(error);
            }

            // res(data)
        } catch (error) {
            console('无缓存，下载')

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
function formatBody(a) {
    try {
        let ccc = [];
        let dd = a.replace(/ /g, '').match(/<a[^>]*>[^<]*<\/a>/g)
        for (let i = 0; i < dd.length; i++) {
            ccc.push(dd[i].match(/(?<=\")(.+?)(?=\")/g, '')[0])
        }
        let size = a.replace(/ /g, '').replace(/<a[^>]*>[^<]*<\/a>/g, '').match(/<pre[^>]*>[^<]*<\/pre>/g, '')[0].replace('<pre>', '').replace('</pre>', '').split('\r\n');
        ccc = ccc.filter(item => {
            return !['../', 'docs/', 'win-x64/', 'win-x86/'].includes(item)
        })
        size = size.reduce((prev, next, index) => {
            let ind = next.indexOf(':')
            if (next !== '' && next.slice(ind + 3) !== '-') {
                prev.push(next.slice(ind + 3))
            }
            return prev
        }, [])
        let obj = {}
        size.forEach((item, index) => {
            obj[ccc[index]] = size[index]
        })
        return obj
    } catch (error) {
        return {}
    }
}

module.exports = { getfileByUrl, getfileProgress }

// let ccc=[];
// // /\([^\)]+\)/g
// let dd =a.replace(/ /g,'').match(/<a[^>]*>[^<]*<\/a>/g)
// for (let i = 0; i < dd.length; i++) {
//     ccc.push(dd[i].match(/(?<=\")(.+?)(?=\")/g,'')[0])
// }
// let size = a.replace(/ /g,'').replace(/<a[^>]*>[^<]*<\/a>/g,'').match(/<pre[^>]*>[^<]*<\/pre>/g,'')[0].replace('<pre>','').replace('</pre>','').split('\r\n');
// ccc=ccc.filter(item=>{
//     return !['../','docs/','win-x64/','win-x86/'].includes(item)
// })
// size=size.reduce((prev,next,index)=>{
//     let ind = next.indexOf(':')
//     if(next !== '' && next.slice(ind+3) !=='-'){
//         prev.push(next.slice(ind+3))
//     } 
//     return prev
// },[])
// let obj={}
// size.forEach((item,index)=>{
//     obj[ccc[index]]=size[index]
// })
// console.log(ccc,size,obj)
