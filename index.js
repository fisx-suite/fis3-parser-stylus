/**
 * @file fis stylus parser 模块
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = exports = function (content, file, conf) {
    var stylus = exports.parser;

    var _ = fis.util;
    var options = _.assign({
        filename: file.realpath
    }, conf);

    // 初始化查找路径
    var confPaths = options.paths || [];
    [file.dirname].forEach(function (item) {
        if (_.indexOf(confPaths, item) === -1) {
            confPaths.push(item);
        }
    });
    options.paths = confPaths;

    // 初始化 source map
    var sourceMap = options.sourcemap || false;
    var sourceMapFile;
    if (sourceMap) {
        if (_.isBoolean(sourceMap)) {
            sourceMap = {};
        }

        var sourceMapPath = file.realpath + '.map';
        sourceMapFile = fis.file.wrap(sourceMapPath);
        sourceMapFile.setContent('');
        var path = require('path');
        options.sourcemap = _.assign({
            comment: !sourceMap.inline,
            sourceMapURL: path.basename(sourceMapFile.url),
            inline: false
        }, sourceMap);
    }

    var stylusUse = options.use;
    delete options.use;

    // http://stylus-lang.com/docs/js.html#stylusresolveroptions
    var defineOpt = options.define || {url: stylus.resolver()};
    delete options.define;

    // 初始化编译选项
    var compiler = stylus(content);
    Object.keys(options).forEach(function (key) {
        compiler.set(key, options[key]);
    });
    compiler.use(function (style) {
        if (_.isFunction(stylusUse)) {
            stylusUse(style);
        }

        defineOpt && Object.keys(defineOpt).forEach(function (name) {
            style.define(name, defineOpt[name]);
        });
    });

    // 初始化依赖
    var deps = compiler.deps() || [];
    deps.forEach(function (path) {
        file.cache.addDeps(path);
    });

    // 开始编译
    var result;
    compiler.render(function (err, css) {
        if (err) {
            throw err;
        }
        result = css.toString();

        if (compiler.sourcemap && sourceMap && sourceMapFile) {
            sourceMapFile.setContent(JSON.stringify(compiler.sourcemap, null, 2));
            file.derived.push(sourceMapFile);
        }
    });

    return result;
};

exports.parser = require('stylus');
