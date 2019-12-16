const webpack = require("webpack")

module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    devServer: {
        proxy: {
            '/api': {
                target: `http://${process.env.VUE_APP_BASE_API}`,
                // ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    }
}