'use strict';
const PLUGIN_NAME = 'gulp-css-scala';
var through = require('through2'),
    gutil = require('gulp-util'),
    css = require('css'),
    PluginError = gutil.PluginError;

var selectorsFromInput = function(input){
    var selectors = new Array(),
        parsedCss = css.parse(input);
    parsedCss.stylesheet.rules.forEach(function(rule){
        selectors = selectors.concat(rule.selectors);
    });
    return selectors.sort();
};

var createOutput = function(className,input){
    var output = 'class '+className+'{}';

    console.log(selectorsFromInput(input));
    console.log(output);
    return output;
};

var gulpCssScala = function(className) {
    return through.obj(function (file, enc, callback) {
        var isBuffer = false,
            inputString = null,
            result = null,
            outBuffer=null;
        //Empty file and directory not supported
        if (file === null || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        isBuffer = file.isBuffer();
        if(isBuffer){
            inputString = new String(file.contents);
            result = createOutput(className,inputString);
            outBuffer = new Buffer(result);
            var aFile = new gutil.File();
            aFile.path = file.path;
            aFile.contents = outBuffer;
            callback(null,aFile);
        }else{
            this.emit('error',
                new PluginError(PLUGIN_NAME,
                'Only Buffer format is supported'));
            callback();
        }
    });
};
//Export the Method
module.exports = gulpCssScala;
