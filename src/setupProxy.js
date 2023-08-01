const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://localhost:8080/v1/graphql',
      pathRewrite: { '^/graphql': '' },
      changeOrigin: true,
    }),
  );
};
