//r.js对应的压缩文件
({
    appDir:'./',   //项目根目录
    baseUrl:'./script/', //查找源js的根目录
    modules:[{
        name:'main'//指定要优化的模块
    }],
    dir:'./build/',   //指定输出的文件
    findNestedDependencies: true,
    fileExclusionRegExp: /^(r|build)\.js|^\.idea$/,
    optimizeCss: 'standard', //css的压缩方式
    //cssIn: 'src/style/main.css',
    removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件
    shim: {
        "zepto": {
            exports: "$"
        }
    },
    paths: {
        "interface": "./app/interface",
        "zepto": "./libs/zepto/v1.1.6/zepto.min",
        "nativeJS":"./utils/native",
        "model": "./app/model",
        "view": "./app/view",
        "viewModel": "./app/viewModel",
        "bvm":"./utils/bvm/v0.0.1/bvm",
        "text": "./libs/require/require-plugin/text"
    }
})