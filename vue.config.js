module.exports = {
  publicPath: "./",
  outputDir: "yj-snlianxiaoluyan-ui",
  lintOnSave: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  css: {
    extract: false,
    // 是否开启 CSS source map？
    sourceMap: false,
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {}, // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    modules: false,
  },
  // 在多核机器下会默认开启。
  parallel: require("os").cpus().length > 1,
  // PWA 插件的选项。
  pwa: {},
  // devServer: {
  //     proxy: {
  //         '/api': {
  //             target: 'http://20.147.170.5:7050',
  //             changeOrigin: true,
  //             ws: true,
  //             pathRewrite: {
  //                 '^/api': ''
  //             }
  //         },
  //     }
  // }, //适配不同分辨率响应
  chainWebpack: (config) => {
    config.module
      .rule("css")
      .test(/\.css$/)
      .oneOf("vue")
      .resourceQuery(/\?vue/)
      .use("px2rem")
      .loader("px2rem-loader")
      .options({ remUnit: 75 })
      .end();
    //  rootValue = $designWidth*20/320; remUnit: 46.875   750*20*320
    //  如果设计图是750  那么就是75   375 那么就是37.5
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          //适配不同分辨率响应
          require("postcss-plugin-px2rem")({
            rootValue: 75, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ],
      },
    },
    modules: false,
  },
  // 第三方插件的选项
  pluginOptions: {},
};
