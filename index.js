/**
 * @file fis stylus parser 模块
 * @author sparklewhy@gmail.com
 */

'use strict';

var stylus = require('stylus');
module.exports = function (content, file, conf) {
    var _ = fis.util;
    var options = _.assign({
        pathname: file.realpath
    }, conf);

    // 初始化查找路径
    var confPaths = options.paths || [];
    [file.dirname].forEach(function (item) {
        if (_.indexOf(confPaths, item) === -1) {
            confPaths.push(item);
        }
    });
    options.paths = confPaths;

    // 初始化编译选项
    var compiler = stylus(content)
        .set('filename', options.pathname)
        .set('compress', !!options.compress)
        .set('paths', options.paths)
        .set('sourcemap', options.sourcemap || false)
        .use(function (style) {
            if (_.isFunction(options.use)) {
                options.use(style);
            }

            var defineOpt = options.define;
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
    });

    return result;
};
