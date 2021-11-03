const {createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(createProxyMiddleware ('/api', 
        {
            target: 'http://192.168.0.45:9090/',
            changeOrigin: true,
            pathRewrite: {'^/api':''}
        }
    ));
}