## 项目名称
vueUIProject

## 项目初始化
yarn install

## 开发运行
yann run start

## 打包发布
yarn run build
打包完成后根目录下的dist目录中的文件为全部打包好的资源

## 文件结构 
├─build wepback配置文件及开发服务器配置文件
│      setup.dev.config.js 开发服务器配置文件
│      webpack.base.config.js 公共配置文件
│      webpack.client.config.js webpack客户端配置文件
│      webpack.server.config.js webpach服务端配置文件 
└─src
    ├─client-entry.js ssr浏览器端入口我文件
    ├─server-entry.js ssr服务器端入口我文件
    ├─public  静态文件    
    ├─router  路由文件
    ├─store   vuex相关文件    
    ├─vendors 公共依赖包文件
    └─views   页面组件文件