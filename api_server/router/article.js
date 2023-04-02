// 文章管理的路由模块

const express = require('express');
const router = express.Router();
// 导入文章管理的处理函数模块
const article_handler = require('../router_handler/article');

// 由于此接口涉及到文件上传的功能，因此提交的请求体，必须是FormData格式
// 使用express.urlencoded()中间件无法解析multipart/form-data格式的请求体数据
// 当前项目，推荐使用multer来解析multipart/form-data格式的表单数据
// npm i multer@1.4.2

// 导入解析formdata格式表单数据的包multer
const multer = require('multer');
const path = require('path');

// 创建multer的实例对象，通过dest属性指定文件的存放路径
const uploads = multer({ dest: path.join(__dirname, '../uploads') });

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { add_article_schema } = require('../schema/article');

// 发布文章的路由
// upload.single()是一个局部生效的中间件，用来解析FormData格式的表单数据
// 将文件类型的数据，解析并挂载到req.file属性中
// 将文本类型的数据，解析并挂载到req.body属性中
// 注意：在当前的路由中，先后使用了两个中间件：先使用multer解析表单数据，再使用expressJoi对解析的表单数据进行验证
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle);
// 获取文章列表数据的路由
router.get('/list', article_handler.getArticle);
// // 根据Id删除文章数据的路由
// router.get('/delete/:id', expressJoi(delete_cate_schema), artCate_handler.deleteCateById);
// // 根据Id获取文章详情的路由
// router.get('/:id', expressJoi(get_cate_schema), artCate_handler.getArtCateById);
// // 根据Id更新文章信息的路由
// router.post('/edit', expressJoi(update_cate_schema), artCate_handler.updateCateById);

module.exports = router;
