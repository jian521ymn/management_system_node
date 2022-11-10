const request = require("request");
var iconv = require('iconv-lite');
/**
 * [@param](/user/param) url 需要抓取的url地址
 * [@param](/user/param) calback
 */
 function fetchContent(ip,calback){
    return new Promise((resolve, reject) => {
        request(`https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}`, {timeout: 10000, pool: false,encoding : null},(err, response, body)=>{
            var buf =  iconv.decode(body, 'gb2312');
            var str = buf.replace('if(window.IPCallBack) {IPCallBack({','')
                            .replace('});}','')
                                .replace(/\n/g,'')
                                  .split(',');
            let obj=str.reduce((prev,next)=>{
                const [key,value] = next.split(':');
                prev[key.replace(/"/g,'')]=value.replace(/"/g,'');
                return prev;
            },{})  
            resolve(obj)
        });
    })
    
}
module.exports=fetchContent