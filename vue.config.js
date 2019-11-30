

module.exports = {
    lintOnSave: false,
    publicPath:'./',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9997',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}