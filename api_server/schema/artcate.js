// 导入定义验证规则的包
const joi = require('@hapi/joi');

// 定义name和alias的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 定义id的校验规则
const id = joi.number().integer().min(1).required();

// 验证规则对象-新增分类
exports.add_cate_schema = {
    body: {
        name,
        alias,
    },
}

// 验证规则对象-根据Id删除分类
exports.delete_cate_schema = {
    params: {
        id,
    },
}

// 验证规则对象-根据Id获取分类
exports.get_cate_schema = {
    params: {
        id,
    },
}

// 验证规则对象-根据Id更新分类
exports.update_cate_schema = {
    body: {
        Id: id, // 注意这里不能改，因为属性名Id是客户端提交给服务器的请求对象req身上携带的属性，前后端都会用到这个属性名
        name,
        alias,
    },
}
