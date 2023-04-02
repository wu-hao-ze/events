// 用户登陆注册的路由模块

const express = require('express');
const router = express.Router();
// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user');

// 安装@escook/express-joi中间件，来实现自动对表单数据进行验证的功能
// npm i @escook/express-joi
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user');

// 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 数据验证失败后，终止后续代码的执行，并抛出一个全局的Error错误，进入全局错误级别中间件中进行处理
// 注册新用户的路由
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser);
// 登录的路由(和注册用一个验证规则)
router.post('/login', expressJoi(reg_login_schema), user_handler.login);

module.exports = router;
