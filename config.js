module.exports = {
	//=>WEB服务端口号
	PORT: 3334,

	//=>CROS跨域相关信息
	CROS: {
		ALLOW_ORIGIN: 'http://114.215.183.5:3336,http://114.215.183.5:3337,http://114.215.183.5:3333,http://114.215.183.5,http://jianymn.top',
		ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		HEADERS: 'Content-Type,Content-Length,Authorization, Accept,X-Requested-With',
		CREDENTIALS: true
	},

	//=>SESSION存储相关信息
	SESSION: {
		secret: 'jianymn',
		saveUninitialized: false,
		resave: true,
		cookie: {
			maxAge: 1000 *5
		}
	}
};