![logo](Dead-Line-images/logo.png)

[![](https://camo.githubusercontent.com/7a0a771cbdf662004ca7a7630ccfee755a810e25d0318cdb7ed7b9b26a56cccc/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5655452d312e382b2d6f72616e6765)](https://camo.githubusercontent.com/7a0a771cbdf662004ca7a7630ccfee755a810e25d0318cdb7ed7b9b26a56cccc/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5655452d312e382b2d6f72616e6765) [![](https://camo.githubusercontent.com/853ee866ed275b471b9b76a893abaaa8c143f5c5f96d42cc33add391ee22b5c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d7942617469732d332e352e352d726564)](https://camo.githubusercontent.com/853ee866ed275b471b9b76a893abaaa8c143f5c5f96d42cc33add391ee22b5c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d7942617469732d332e352e352d726564) [![](https://camo.githubusercontent.com/679004bbb2c881a8e6425a2439b573d27abed6df80890825ad3e6ca400cbd42c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5675652d322e362e31312d627269676874677265656e)](https://camo.githubusercontent.com/679004bbb2c881a8e6425a2439b573d27abed6df80890825ad3e6ca400cbd42c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5675652d322e362e31312d627269676874677265656e) [![](https://camo.githubusercontent.com/2bb630e2707a04100cd270fd944d22816241c37b68a5a1629257920c65e17891/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c7565)](https://camo.githubusercontent.com/2bb630e2707a04100cd270fd944d22816241c37b68a5a1629257920c65e17891/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c7565) 


# **简介**


DeadLine是一个社交圈子论坛微信小程序，当前产品功能以（图文、视频、投票）动态分享为核心，支持点赞、评论、回复、分享。是一套兴趣社区论坛系统，将来版本迭代会增加活动、商城、IM 等功能，将来也会开发 APP 和网页端。项目分为Uniapp用户端（兼容微信小程序版本）和后台管理端。


> 本着『前后端分离，人不分离』的要领，开发了此基于 ThinkPHP6 + vue + uniapp 前后端分离的社交圈子论坛系统（小程序）


***

官网: [https://www.uosat.com](https://www.uosat.com)

文档: [https://www.uosat.com/docs](https://www.uosat.com/docs)

# **Demo**


### 1.uniapp移动端（后端服务域名备案，暂未发布）


![输入图片说明](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220909191604.jpg)


#### 1.1演示图


暂无


### 2.后台管理系统:


<https://deadline.uosat.com/admin>  账号：test  密码：123456（因测试账号部分功能受限）


#### 2.1演示图
![](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220910155409.jpg)
![](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220910155422.jpg)
![](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220910155425.jpg)
![](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220910155438.jpg)
![](Dead-Line-images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220910155441.jpg)
# **软件架构**


核心框架：Vue2.x、Vue Router、Vuex

Vue 项目基于 @vue/cli4.x 构建

JS 依赖及参考的 css：[v-viewer](https://github.com/fengyuanchen/viewerjs)、[APlayer](https://github.com/DIYgod/APlayer)、[MetingJS](https://github.com/metowolf/MetingJS)、[lodash](https://github.com/lodash/lodash)、[mavonEditor](https://github.com/hinesboy/mavonEditor)、[echarts](https://github.com/apache/echarts)、[tocbot](https://github.com/tscanlin/tocbot)、[iCSS](https://github.com/chokcoco/iCSS)


### 后台 UI


后台 CMS 部分基于 [my-vue-admin-template](https://github.com/Naccl/my-vue-admin-template) 模板进行开发

UI 框架为 [元素 UI](https://github.com/ElemeFE/element)


### 前台用户界面


[Element UI](https://github.com/ElemeFE/element)：部分使用，一些小组件，弥补了 Semantic UI 的不足，便于快速实现效果

文章排版：基于[typo.css](https://github.com/sofish/typo.css) 修改


# 快速开始

1、详细安装文档请参阅：https://vk27n33pjm.k.topthink.com/@deadline/

2、如安装过程中出现404等问题，请配置nginx或Apache伪静态。

3、uniapp端下载后在根目录：utils/config.js中配置站点域名，运行到小程序即可

# 联系

微信：im_0512

QQ交流群：1028610919

![](Dead-Line-images/DeadLine%E5%9C%88%E5%AD%90%E9%A1%B9%E7%9B%AE%E4%BA%A4%E6%B5%81%E7%BE%A4%E7%BE%A4%E8%81%8A%E4%BA%8C%E7%BB%B4%E7%A0%81.png)
