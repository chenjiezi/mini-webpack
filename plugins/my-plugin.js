class MyPlugin {
  apply(compiler) {
    // 注册compiler上的emit钩子
    compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, cb) => {
      console.log("compilation.assets:", compilation.assets);

      cb();
    });
    // 注册compiler上的done钩子
    compiler.hooks.done.tap("My Plugin", (stats) => {
      console.log("MyPlugin");
    });
  }
}

module.exports = MyPlugin;
