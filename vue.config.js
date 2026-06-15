module.exports = {
  publicPath: "./",
  outputDir: "dist",
  lintOnSave: true,
  productionSourceMap: false,
  parallel: require("os").cpus().length > 1,
  pwa: {},
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
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
  },
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 75,
            exclude: /(node_module)/,
            mediaQuery: false,
            minPixelValue: 3,
          }),
        ],
      },
    },
    modules: false,
  },
  pluginOptions: {},
};
