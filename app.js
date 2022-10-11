const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("babel-core");

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babylon.parse(content, {
    sourceType: "module",
  });
  const dependencies = [];
  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencies.push(node.source.value);
    },
  });
  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    id: ID++,
    filename,
    dependencies,
    code,
  };
}

function findGraph(filename) {
  const mainAsset = createAsset(filename);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = "";
  graph.forEach((mod) => {
    modules += `${mod.id} : [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ], `;
  });

  return `(function (modules) {
    function require (id) {
      const [ fn, mapping ] = modules[id]
      function localRequire (name) {
        return require(modules[name])
      }
      const module = { exports: {} }
      fn(localRequire, module, module.exports)

      return module.exports
    }
    require(0)
  })({${modules}})`;
}

const graph = findGraph("./example/entry.js");
const result = bundle(graph);

fs.mkdir("dist", (err) => {
  if (!err) {
    fs.writeFile("dist/main.js", result, (err1) => {
      if (!err1) {
        console.log("打包成功");
      }
    });
  }
});
