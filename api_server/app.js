// app.js为整个项目的入口文件
const express = require('express');
const app = express();
const joi = require('@hapi/joi');
// 导入并配置cors中间件，实现跨域访问
const cors = require('cors');
app.use(cors());
// 配置解析表单数据的中间件，注意：这个中间件只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

// 在处理函数中，需要多次调用res.send()向客户端响应处理失败的结果，为了简化代码，可以手动封装一个res.cc()函数
// 一定要在路由之前，封装res.cc函数
app.use((req, res, next) => {
    // status默认值为1，表示失败的情况
    // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status, // 对象里的属性名和属性值的变量名相同时，可以省略写
            message: err instanceof Error ? err.message : err,
        })
    }
    next();
})

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt');
const config = require('./config');
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }));



// router文件夹，用来存放所有的路由模块
// 路由模块中，只存放客户端的请求与处理函数之间的映射关系
// router_handler文件夹，用来存放所有的路由处理函数模块
// 路由处理函数模块中，专门负责存放每个路由对应的处理函数

// 导入并使用用户注册登录的路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter)
// 导入并使用文章管理的路由模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 注意要写return，因为不能出现一个函数里面两个res.send

    // 验证规则失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 捕获并处理Token认证失败后的错误(身份认证失败后的错误)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
    // 未知的错误
    res.cc(err);
})

app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})
