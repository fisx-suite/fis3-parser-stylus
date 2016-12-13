fis3-parser-stylus
========

[![Dependency Status](https://david-dm.org/wuhy/fis3-parser-stylus.svg)](https://david-dm.org/wuhy/fis3-parser-stylus) [![devDependency Status](https://david-dm.org/wuhy/fis3-parser-stylus/dev-status.svg)](https://david-dm.org/wuhy/fis3-parser-stylus#info=devDependencies) [![NPM Version](https://img.shields.io/npm/v/fis3-parser-stylus.svg?style=flat)](https://npmjs.org/package/fis3-parser-stylus)


> A parser for fis3 to compile stylus files.


## How to use
 
### Install
 
```shell
npm install fis3-parser-stylus -g
```

### Add configure to `fis-conf.js`

```javasciprt
fis.match('*.styl', {
    parser: 'stylus',
    rExt: '.css'
});
```

Custom parse options:

```javasciprt
fis.match('*.styl', {
    parser: fis.plugin('stylus', {
        sourcemap: true
    }),
    rExt: '.css'
});
```

Available options, please refer to [stylus](http://stylus-lang.com/).


 

 
