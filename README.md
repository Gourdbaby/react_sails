# Introduction
    这是一个react的前端项目 该项目主要是和我的github上的另一个后端项目配合做的Helloworld
    项目地址 [sails](https://github.com/huluwa123/sails)
# usage
    step 1 `git clone`
    step 2 `cd react-frontend`
    step 3 `npm install`
    step 4 `npm run start:dev` (生产环境执行 `npm run start:prod`)



### mark
* babel中的babel-plugin-transform-runtime和babel-polyfill 
***
Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。<br/>
详细信息请[click](https://segmentfault.com/q/1010000005596587)