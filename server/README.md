## panda shop node.js 后台

1. 底层框架使用 koa2
1. 自建的 MVC 流程
1. 使用 sequelize 来操作 mysql 数据库
1. 小程序的登录注册使用 [JWT](https://github.com/hiscc/panda-chat-room/tree/jwtLogin) 来实现
1. 小程序的支付流程使用 [tenpay](https://www.npmjs.com/package/tenpay) 工具库

### 基本结构说明

#### controller

controller 文件夹内对应着所有模型的具体操作，例如用户注册登录、支付、查询等。

controller 用于操作数据模型 models 并返回数据。

#### middlewares

middlewares 文件夹内对应着所有路由的中间处理环节，例如在 /user/login 路由上预先加密解密微信用户信息并挂载到 ctx.state 命名空间上，然后继由 controller 进行后续处理。

node.js 中的中间件主要用于处理在接收请求后和程序发出响应这段时间内的一些状态。 例如用户鉴权、判断数据是否合法等。

#### models

models 文件夹内对应着所有模型的数据结构，「即数据库中的数据结构和一些校验逻辑」。 我们在 /models/index.js 内配置 sequelize 的数据库链接并制定所有数据模型的关系「 hasone、belongsto 等等」。

models 即数据模型，是所有数据的来源，一般用于定义数据格式。相比于前端的 models ，后端的 models 还需要做一些数据校验、挂载模型方法等操作。

#### router

router 文件夹内预制我们所有的路由路径，在这里为每一个资源配置相应的路由 API。

router 路由， 在后端开发中路由更多是指一条路径所对应着的资源及操作「json、xml等」，在前端开发中一般对应着的是一个视图。

#### services

services 文件夹下放置所有的可重用服务，例如 token 的生成、加密解密、微信用户的加密解密等常用功能。

services 服务，我们的 app 需要的任何 mock 值、功能、类、函数都属于服务， 比起大家常说的工具函数，它的范围更广。
