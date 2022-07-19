// UPDATE `jianymn_admin`.`USER` SET `token` = '3755d3f0b357d8479a81ddd50d6354822', `tokenTime` = '0000-00-00 00:00:02' WHERE `USER`.`id` = 0
const dayjs=require('dayjs')
const baseMyspl = `jianymn_admin`  //基础库名称

/**
* name:"USER",目标库表名，
* params:{a:1},更新的字段对象集合
* primaryKey:{key:主键ke,value：主键value, isString:主键value是否为字符串}
*/ 
// 更新数据库字段
const updateMyspl = (param)=>{
    const {name,params,primaryKey:{key,value, isString =true}} = param||{}
    let before = "UPDATE `"+ baseMyspl+"`.`"+name+"` SET ";
    let middle = Object.keys(params).reduce((val,next,index)=>{
        return val + "`"+next+"` = '"+params[next]+(index!==Object.keys(params).length-1?"', ":"' ")
    },"")
    let after = "WHERE `"+ name +"`.`"+ key +"` ="+" "+ (isString?"'"+value+"'":value);
    console.log(before+middle+after,'修改指令',dayjs().format('YYYY-MM-DD HH:mm:ss'))
    return before+middle+after
}

/**
* name:"USER",目标库表名，
* params:[],更新的字段数组对象集合
* key:主键名称
*/ 
// 批量更新数据库字段
const updateMysplBatch = (param)=>{
    const {name,params,key} = param||{};
    let newParams = params?.reduce((prev,next)=>{
        Object.keys(next)?.forEach((item)=>{
            prev[item] = [...(prev[item] || []),(next[item] || '')]
        })
        return prev;
    },{});
    let keyArr = [...newParams[key]];
    delete newParams[key];
    let before = "UPDATE `"+ baseMyspl+"`.`"+name+"` SET ";
    let middle = Object.keys(newParams).reduce((prev,next,index)=>{
        prev+=` ${next}= CASE ${key}  ` + keyArr?.reduce((pre,nex,ind)=>{
            const value =newParams[next][ind]
            pre+=`WHEN ${( typeof(nex) === 'string' ? ("'"+nex+"'") : nex )} THEN `+ ( typeof(value) === 'string' ? ("'"+value+"'") : value ) + ' '
            return pre
        },'')
        if(Object.keys(newParams).length-1 !== index) {
            prev+= ` END, `
        }
        return prev
    },"")
    let after = `END WHERE ${key} IN(${keyArr.join(',')})`;
    console.log(before+middle+after,'批量修改指令',dayjs().format('YYYY-MM-DD HH:mm:ss'))
    return before+middle+after
}

/**
* name:"USER",目标库表名，
* params:{a:1},查询搜索的字段对象集合
* page:" 1,10 ", 分页配置，不传则全量
* like:"LIKE",匹配方式，模糊匹配或精准匹配
* sort：{ConfigID:ASC,MarketID:DESC}排序字段及其方式
*/ 
// 查询数据库字段
const queryMyspl = (param)=>{
    const {name,params,page,like="LIKE",sort} = param || {}
    let isZeroParams=Object.keys(params).length === 0 ? '' : "` WHERE "
    let before = "SELECT SQL_CALC_FOUND_ROWS * FROM `"+ name+ isZeroParams;
    let middle = Object.keys(params).reduce((val,next,index)=>{
        if(index === 0){
            return val+="`"+next+"` "+like+" '"+params[next]+"' "
        }
        return val + "AND `"+next+"` "+like+" '"+params[next]+"' "
    },"")
    let sortAry =Object.keys(sort || {})
    let after =sortAry.length ===0 ? "":sortAry.reduce((str,next,index)=>{
        if(index ===sortAry.length -1){
            str+= "`"+next+"`"+" "+ sort[next]
        }else{
            str+= "`"+next+"`"+" "+ sort[next]+", "
        }
        return str
    } ,"ORDER BY ")
    let LIMIT =page ? ` LIMIT ${page}` : ''
    // console.log(before+middle+after+LIMIT,'查询指令',dayjs().format('YYYY-MM-DD HH:mm:ss'))
    return before+middle+after+LIMIT
}
/**
* name:"USER",目标库表名，
* params:{a:1},新增字段对象集合
* page:" 1,10 ", 分页配置，不传则全量
*/ 
// 数据库新增指令
const addMyspl = (param)=>{
    const {name,params} = param || {};
    let before = "INSERT INTO `"+ baseMyspl+ "`.`"+ name+"`";
    let middle = " ("+ Object.keys(params).map(item=>("`"+item+'`')).join() +") "
    let after = " ("+ Object.values(params).reduce((str,next,index)=>{
        if(index ===Object.values(params).length-1){return str+=("'"+next+"'")};
        return str+= ("'"+next+"'")+","
    },"") +") "
    // console.log(before+middle+" VALUES "+ after,'新增指令', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    return before+middle+" VALUES "+ after
}
module.exports = {updateMyspl, queryMyspl, addMyspl,updateMysplBatch}