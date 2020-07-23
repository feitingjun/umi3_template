export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /admin/login': (req, res) => {
    if (req.body.username != 'admin' || req.body.password != '123456') {
      res.send({
        code: 0,
        data: null,
        msg: '用户名或密码错误',
      });
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
        menuList: [
          {
            name: '需求订单管理',
            route: '/demand',
            id: 1,
            // icon: 'profile',
            children: [
              {
                id: 2,
                name: '需求类目管理',
                route: '/demand/category',
              },
              {
                id: 3,
                name: '需求管理',
                route: '/demand/list',
              },
              {
                id: 4,
                name: '需求订单投诉',
                route: '/demand/complain',
              },
              {
                id: 5,
                name: '评论管理',
                route: '/demand/review',
              },
              {
                id: 6,
                name: '需求字典配置',
                route: '/demand/dictionary',
              },
            ],
          },
          {
            id: 7,
            name: '用户管理',
            route: '/userManage',
            children: [
              {
                id: 8,
                name: '用户详情',
                route: '/userManage/:id',
              },
            ],
            // icon: 'user'
          },
          {
            id: 9,
            name: '菜单管理',
            route: '/menuManage',
            // icon: 'user'
          },
        ],
      },
    });
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
      menuList: [
        {
          name: '需求订单管理',
          route: '/demand',
          id: 1,
          // icon: 'profile',
          children: [
            {
              id: 2,
              name: '需求类目管理',
              route: '/demand/category',
            },
            {
              id: 3,
              name: '需求管理',
              route: '/demand/list',
            },
            {
              id: 4,
              name: '需求订单投诉',
              route: '/demand/complain',
            },
            {
              id: 5,
              name: '评论管理',
              route: '/demand/review',
            },
            {
              id: 6,
              name: '需求字典配置',
              route: '/demand/dictionary',
            },
          ],
        },
        {
          id: 7,
          name: '用户管理',
          route: '/userManage',
          children: [
            {
              id: 8,
              name: '用户详情',
              route: '/userManage/:id',
            },
          ],
          // icon: 'user'
        },
        {
          id: 9,
          name: '菜单管理',
          route: '/menuManage',
          // icon: 'user'
        },
      ],
    },
  },
};
