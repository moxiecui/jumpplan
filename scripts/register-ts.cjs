const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const original = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  return original.call(this, request.startsWith('@/') ? path.join(__dirname, '../src', request.slice(2)) : request, parent, isMain, options);
};
require.extensions['.ts'] = function(module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename });
  module._compile(output.outputText, filename);
};
