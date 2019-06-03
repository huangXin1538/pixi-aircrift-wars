module.exports = {
  // 选项...
  publicPath: './', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static/game/', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  productionSourceMap: false,
  devServer: { // 代理
    overlay: {
      warnings: true,
      errors: true
    },
    hot: false
  }
};
