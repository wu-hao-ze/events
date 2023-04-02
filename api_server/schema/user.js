// 用户信息验证规则模块

// 表单验证的原则：前端验证为辅，后端验证为主，后端是数据合法性验证的最后一个关口
// 单纯的使用if...else...的形式对数据合法性进行验证效率低下、出错率高、维护性差。
// 因此，推荐使用第三方数据验证模块，来降低出错率、提高验证的效率与可维护性，让后端程序员把更多的精力放在核心业务逻辑的处理上
// 安装@hapi/joi包，为表单中携带的每个数据项定义验证规则
// npm install @hapi/joi@17.1.0

/*
    string()：值必须是字符串
    alphanum()：值只能是包含a-zA-Z0-9的字符串
    number()：必须是数字类型
    integer()：必须是整数类型，不能带小数点
    min(length)：最小长度
    max(length)：最大长度
    required()：是必填项，不能为undefined
    pattern(正则表达式)：值必须符合正则表达式的规则
    email()：必须是邮箱的格式
    dataUri()：必须是base64格式的字符串数据，比如：data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
*/
    

// 导入定义验证规则的包
const joi = require('@hapi/joi');

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required(); // 非空白字符6~12位

// 定义id，nickname，email的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const user_email = joi.string().email().required();

// 定义验证avatar头像的验证规则
const avatar = joi.string().dataUri().required();

// 验证规则对象-注册登录
exports.reg_login_schema = {
    // 表示对req.body中的数据进行验证
    // 注意这里是es6的写法，当对象的属性名和属性值的变量名相同时可以省略写
    // 客户端提交到服务器的就是req.body中的属性名username，password，这里定义的属性值也是username，password，所以可以省略写
    body: {
        username,
        password,
    },
};

// 验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
    body: {
        id,
        username,
        nickname,
        email: user_email,
    },
}

// 验证规则对象-更新密码
// 旧密码与新密码必须符合密码的验证规则，并且新密码不能与旧密码一致
// joi.ref('oldPwd')表示newPwd的值必须和oldPwd的值保持一致
// joi.not(joi.ref('oldPwd'))表示newPwd的值不能等于oldPwd的值
// .concat()用于合并joi.not(joi.ref('oldPwd'))和password这两条验证规则
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

// 验证规则对象-更新头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}
