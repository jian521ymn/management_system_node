const  fs = require('fs');
const {execPromise} = require('jian_ymn_node/fs/index');

// 先更新分支，再获取所有分支
execPromise('git fetch && git branch').then(res=>{
	let allBranch=[]
	// 处理git branch 的结果，
	res.stdout.split('\n').forEach(item=>{
		const branch =item.replace(/(\s)/g, '').replace(/\*/g,'');
		// 忽略为空的分支和远程分支
		if(branch && !branch.includes('origin/')){
			allBranch.push({[branch] :branch})
		}
	})
	// 得到分支列表
	return allBranch
});

