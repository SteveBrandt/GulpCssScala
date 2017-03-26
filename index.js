'use strict';

const PLUGIN_NAME = 'gulp-css-scala';
var through = require('through2'),
    gutil = require('gulp-util'),
    css = require('css'),
    mergeOptions = require('merge-options'),
    PluginError = gutil.PluginError;

var defaultOptions = {
    packageName :   'com.example.css',
    className   :   'Css'
};

// sort and remove duplicates
var beautify = function(array) {
    return array.sort().filter(function(item, position, source) {
        return !position || item !== source[position - 1];
    })
};

// parse css input and return selectors
var selectorsFromInput = function(input) {
    var selectors = [],
        parsedCss = css.parse(input);
    parsedCss.stylesheet.rules.forEach(function(rule) {
        selectors = selectors.concat(rule.selectors);
    });
    return beautify(selectors);
};

// active                 -> active
// ItemContent            -> itemcontent
// MathJax_Display        -> mathjaxDisplay
// Zebra_DatePicker_Icon  -> zebraDatePickerIcon
// add-bookmark-folder    -> addBookmarkFolder
// addthis_custom_sharing -> addthisCustomSharing
// --                     -> As
// __                     -> Child
var normalizeSelector = function(selector) {
    return selector
        .replace(/--/g, '-As-')
        .replace(/__/g, '-Child-')
        .replace(/_/g, '-')
        .replace(/\./g, '')
        .split('-')
        .map(function(word, idx) {
            // Capitalize first char for consecutive words
            if (idx > 0) {
                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
            }
            return word.toLowerCase();
        })
        .join('');
};

var createOutput = function(input,options) {

    var output = '';

    output += 'package ' + options.packageName + "\n\n";

    output += "// File is generated by gulp-css-scala\n\n"
            + 'class ' + options.className + ' {' + "\n";
    
    selectorsFromInput(input).forEach(function(selector) {
        output += '  val ' + normalizeSelector(selector) + ': String = "' + selector.replace(/\./g,'') + '"' + "\n"
    });

    output += '}';

    return output;
};

var gulpCssScala = function(opts) {

    var options = mergeOptions(defaultOptions, opts);

    return through.obj(function (file, enc, callback) {
        var inputString = null,
            result = null,
            outBuffer = null;

        // empty file and directory not supported
        if (file === null || file.isDirectory()) {
            this.push(file);
            return callback();
        }

        if (file.isBuffer()) {
            inputString = new String(file.contents);
            result = createOutput(inputString, options);
            outBuffer = new Buffer(result);
            var aFile = new gutil.File();
            aFile.path = file.path;
            aFile.contents = outBuffer;
            callback(null, aFile);
        } else {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
            callback();
        }
    });
};

// export the Method
module.exports = gulpCssScala;
