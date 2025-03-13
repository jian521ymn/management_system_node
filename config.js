module.exports = {
	//=>WEB服务端口号
	PORT: 3334,

	//=>CROS跨域相关信息
	CROS: {
		ALLOW_ORIGIN: 'http://47.94.11.121:3336,http://47.94.11.121:9002,http://47.94.11.121:3337,http://47.94.11.121:3333,http://47.94.11.121:4000,http://47.94.11.121:3000,http://47.94.11.121,http://jianymn.top/',
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