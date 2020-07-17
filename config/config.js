import { defineConfig, utils } from 'umi';
import path from 'path';

export default defineConfig({
    // routes: [
    //   {
    //     path: '/',
    //     component: '../layouts/index',
    //     routes: [
    //       { path: '/', component: '../pages/index' }
    //     ]
    //   }
    // ],
    history: {
      type: 'hash'
    },
    mock: false,
    antd: {},
    cssLoader: {
      // 这里的 modules 可以接受 getLocalIdent
      // modules: {
      //   // getLocalIdent: (context, localIdentName, localName, options) => {
      //   //   return localName;
      //   // },
      //   localIdentName: '[path][name]__[local]--[hash:base64:5]'
      // },
    },
    dva: {
      immer: true
    },
    dynamicImport: {},
    // theme: {},
    // plugins: [
    //   'umi-plugin-antd-theme'
    // ],
    // 'antd-theme': themeConfig,
    publicPath: './',
    hash: true, //开启文件hash名
    proxy: {
        "/admin": {
          "target": "http://localhost:7001",
          "changeOrigin": true,
          // "pathRewrite": { "^/api" : "" }
        }
    },
});
