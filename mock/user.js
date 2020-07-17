export default {
// 支持值为 Object 和 Array
'GET /api/users': { users: [1, 2] },

// GET POST 可省略
'/api/users/1': { id: 1 },

// 支持自定义函数，API 参考 express@4
'POST /admin/login': (req, res) => {
    if(req.body.username != 'admin' || req.body.password != '123456'){
        res.send({
            code: 0,
            data: null,
            msg: '用户名或密码错误'
        })
        return false;
    }
    res.send({
        code: 200,
        data: {
            userInfo: {
              username: 'admin',
              logo: '/src/assets/11.jpg',
              head: '/src/assets/22.jpg',
            },
            menuList: [{
                    name: '需求订单管理',
                    route: '/demand',
                    // icon: 'profile',
                    children: [{
                        name: '需求类目管理',
                        route: '/demand/category'
                    },{
                        name: '需求管理',
                        route: '/demand/list' 
                    },{
                        name: '需求订单投诉',
                        route: '/demand/complain' 
                    },{
                        name: '评论管理',
                        route: '/demand/review' 
                    },{
                        name: '需求字典配置',
                        route: '/demand/dictionary'
                    }]
                },{
                    name: '用户管理',
                    route: '/userManage',
                    children: [{
                      name: '用户详情',
                      route: '/userManage/:id'
                    }]
                    // icon: 'user'
                },{
                    name: '角色管理',
                    route: '/roleManage',
                    // icon: 'user'
            }]
        }
    })
},
// 支持自定义函数，API 参考 express@4
'GET /admin/info': {
    code: 200,
    data: {
        userInfo: {
          username: 'admin',
          logo: '/src/assets/11.jpg',
          head: '/src/assets/22.jpg',
        },
        menuList: [{
                name: '需求订单管理',
                route: '/demand',
                // icon: 'profile',
                children: [{
                    name: '需求类目管理',
                    route: '/demand/category'
                },{
                    name: '需求管理',
                    route: '/demand/list' 
                },{
                    name: '需求订单投诉',
                    route: '/demand/complain' 
                },{
                    name: '评论管理',
                    route: '/demand/review' 
                },{
                    name: '需求字典配置',
                    route: '/demand/dictionary'
                }]
            },{
                name: '用户管理',
                route: '/userManage'
                // icon: 'user'
            },{
                name: '角色管理',
                route: '/roleManage',
                // icon: 'user'
        }]
    }
}
}
