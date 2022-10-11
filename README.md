# mini-webpack

## 功能

打包构建项目流程，不包含 loader 和 plugin

## 思路

- 第一步：通过 babylon 将 js 源码转为 AST
- 第二步：通过 babel-traverse 遍历 AST，根据 import 找出依赖图（依赖与依赖之间的引用关系），借助 babel-core 将 es6 转成 es5
- 第三步：通过依赖图打包构建源代码
- 第四步：把构建的源代码输出到目标文件里
