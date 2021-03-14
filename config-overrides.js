const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// const rewireLess = require("react-app-rewire-less");

module.exports = function override(config, env) {
  // config = rewireLess(config, env);

  // console.log(config)
  // config.plugins.push({
  //   javascriptEnabled: true,
  //   modifyVars: { '@base-color': '#f44336' }
  // })

  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ["json"],
    })
  );
  return config;
};
