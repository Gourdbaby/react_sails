
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractLESS = new ExtractTextPlugin('stylesheets/[name].css');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const config = {
    entry: {
        base:'./common/base.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'js/[name].[hash].js',
        publicPath:'/dist' // 配置webpack加载静态文静的路径
    },
    module:{
        rules:[{
            test:require.resolve('./common/base.js'),
            use:{
                loader: 'expose-loader',
                options: 'Base'
            }
        },{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react']
                }
            }
        },{
            test: /\.css$/,
            use: extractLESS.extract({
                fallback: "style-loader",
                use: ['css-loader']
            })
        },{
            test: /\.less$/,
            use: extractLESS.extract({
                fallback: "style-loader",
                use: ['css-loader', 'less-loader']
            })
        },{
            test: /\.html$/,
            exclude: /node_modules/,
            use: [ {
              loader: 'html-loader',
              options: {
                minimize: false,
                removeComments: true,
              }
            }],
          },{
            test: /\.(png|jpg|gif|jpe?g)$/,
            exclude: /node_modules/,
            use: [
                {
                loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name:'/images/[hash].[name].[ext]'
                    }
                }
            ]
        },{
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
                loader:'file-loader',
                options:{
                    name:'/font/[name].[ext]'
                }
            }]
        }]
    },
    plugins: [
        extractLESS,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            React: 'react',
            ReactDOM: 'react-dom'
        })
    ],
    resolve:{
        alias:{
            component: path.resolve(__dirname, './component/'),
            vendors: path.resolve(__dirname, './vendors/'),
            common: path.resolve(__dirname, './common/')
        }
    },
    optimization:{  // 无论是css  还是 js  这个配置都会把相同的 文件给抽离出来形成一个功能的文件引入到页面当中 很牛B。
        splitChunks:{  // 还没搞明白 这个里是怎么设置的 但是webpack确实是给公共的代码抽出来了
            chunks:'initial',// 必须三选一： "initial" | "all"(默认就是all) | "async" ->>> 还不知道这三个参数的作用。
            minChunks : 4,  // 这里应该是设置 超过几个页面引入相同的文件就开始抽出来相同的代码组成一个新的文件
                            // 这里我设置成了4 也就是如果有4个页面都引入了相同的代码 就把该文件抽出来形成一个公共的文件
                            // 但是 经过测试 我只有2页面引入了相同的文件 webpack也会抽出相同的文件 ... 不知作何解释。
            name:'commons2',
            cacheGroups:{ //这里开始设置缓存的 chunks
                vendor:{
                    chunks:'initial',// 必须三选一： "initial" | "all"(默认就是all) | "async" 
                    name:'commons222',
                    minChunks:4,
                }
            }
        }
    },
    devServer:{
        host: "0.0.0.0",
        port: 3001,
        open: true,
        openPage:'dist/reactlogin.html',
        publicPath:'/dist', //配置 浏览器访问文件的路径
        proxy: {
            "/api/**": {
                target: "http://localhost:1337",
                pathRewrite: {"^/api" : ""}
            }
        }
    },
    devtool:'cheap-module-source-map'
} 

let entryPage = path.join(__dirname, 'pages/'),
    entries = [];
glob.sync(entryPage+'*').forEach(item => {
    entries.push({
        name:path.basename(item),
        path:item
    })
})
entries.forEach(item => {
    config.entry[item.name] = path.join(item.path,'index.js');
    config.plugins.push(new htmlWebpackPlugin({
        filename:item.name + '.html',
        template:item.path + '/template.html',
        chunks:['base', 'commons2', item.name]
    }))
})

module.exports = config;