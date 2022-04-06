
// 通过buffer流解析xlsx文件的内容
const fs = require('fs')
const xlsx = require('node-xlsx')
 

const xlsxParsing =(Buffer)=>{
    let exceldata = xlsx.parse(Buffer)
    let exportData = []
    for (let rowId in exceldata[0]['data']) {
        let row = exceldata[0]['data'][rowId]
        // console.log(row[0])
        exportData.push(row[0])
    }
    let obj={};
    obj.clonums=exceldata[0].data[0]
    obj.list=exceldata[0].data.reduce((all,next,index)=>{
        if(index === 0){return all};
        all.push(next)
        return all
    },[])
    return obj
}

module.exports=xlsxParsing