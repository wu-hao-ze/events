// 导入数据库操作模块
const db = require('../db/index');
const path = require('path');

// 发布文章的处理函数
exports.addArticle = (req, res) => {
    // 路由中通过express-joi自动验证req.body中的文本数据，这里通过if手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');

    // 处理文章的信息对象
    const articleInfo = {
        // 标题、内容、发布状态、所属分类的Id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }

    const sql = `insert into ev_articles set ?`;
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('发布新文章失败！');
        res.cc('发布文章成功！', 0);
    })
}

// 获取文章列表数据的处理函数
exports.getArticle = (req, res) => {
    // 定义查询分类列表数据的SQL语句
    const sql = `select * from ev_articles where is_delete=0 order by id asc`;
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: '获取文章列表数据成功！',
            data: results,
        });
    });
}
