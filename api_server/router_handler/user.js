// 为了保证密码的安全性，不建议在数据库以明文的形式保存用户密码，推荐对密码进行加密存储
// 在当前项目中，使用bcryptjs对用户密码进行加密，优点：
// 加密之后的密码无法被逆向破解
// 同一明文密码多次加密，得到的加密结果各不相同，保证了安全性
// 运行如下命令，安装指定版本的bcryptjs
// npm i bcryptjs@2.4.3


// 导入数据库操作模块
const db = require('../db/index');
// 导入bcryptjs包
const bcrypt = require('bcryptjs');
// 导入生成Token的包
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require('../config');

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 对表单中的数据进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不合法！' });
    // }
    // 注意这里合法性校验改为@hapi/joi包验证规则和@escook/express-joi包自动验证的结合应用

    // 定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err);
        }
        // 判断用户名是否被占用，因为查询得到的是数组，所以可以判断数组的length
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！');
        }
        // 确认用户名可用之后，调用bcrypt.hashSync(明文密码, 随机盐的长度)方法，对用户的密码进行加密处理
        // 对用户的密码进行bcrype加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义插入新用户的SQL语句
        const sql = 'insert into ev_users set ?';
        // 调用db.query()执行SQL语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断SQL语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为1
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！');
            // 注册用户成功
            res.cc('注册成功！', 0);
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body;
    const sql = `select * from ev_users where username=?`;
    // 执行SQL语句，根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err);
        // 执行SQL语句成功，但是获取到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！');
        // 判断密码是否正确：调用bcrypt.compareSync(用户提交的密码, 数据库中的密码)方法，比较密码是否一致
        // 返回值是布尔值(true一致、false不一致)
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc('登录失败！');
        // 在服务器端生成Token的字符串，在生成Token字符串的时候，一定要剔除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' };
        // 对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        // 将Token响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用Token，在服务器端直接拼接上Bearer的前缀
            token: 'Bearer ' + tokenStr,
        })
    })
}
