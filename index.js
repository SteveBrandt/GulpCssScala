'use strict';

const PLUGIN_NAME = 'gulp-css-scala';
const through = require('through2'),
    gutil = require('gulp-util'),
    mergeOptions = require('merge-options'),
    PluginError = gutil.PluginError;

const defaultOptions = {
    packageName: 'com.example.css',
    objectName:  'Css'
};


// sort and remove duplicates and empty items
const beautify = function(array) {
    return array.sort()
        .filter(function(item, position, source) {
            // duplicates
            return !position || item !== source[position - 1];
        }).filter(function(item) {
            // empty items
            return (item !== (undefined || ''));
        }).filter(function(item) {
            // only class selectors
            return (item.indexOf('.') === 0);
        });
};

const normalizeInput = function(input) {
    return input
        // remove media queries
        .replace(/@media[^{]*{(?:(?!}\s*}).)*/gm, '')
        // remove css definition
        .replace(/{([^}]*)}/gm, '')
        // remove css comments from input
        .replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
};

// active                 -> active
// ItemContent            -> itemcontent
// MathJax_Display        -> mathjaxDisplay
// Zebra_DatePicker_Icon  -> zebraDatePickerIcon
// add-bookmark-folder    -> addBookmarkFolder
// addthis_custom_sharing -> addthisCustomSharing
// --                     -> As
// __                     -> Child
const normalizeSelector = function(selector) {
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

// parse css input and return selectors
const styleClassSelectorsFromInput = function(input, selectors) {
    const regex = /\.[\w|-]+/g;
    selectors = selectors.concat(
        normalizeInput(input.toString()).match(regex)
    );

    return beautify(selectors);
};

// returns the scala object for selectors
const createOutput = function(options, selectors) {
    var output = 'package ' + options.packageName + "\n\n"
        + '// File is generated by gulp-css-scala' + "\n\n"
        + 'object ' + options.objectName + ' {' + "\n";

    selectors.forEach(function(selector) {
        output += '  val ' + normalizeSelector(selector) + ': String = "' + selector.replace(/\./g, '') + '"' + "\n"
    });

    output += '}';

    return output;
};

const gulpCssScala = function(opts) {

    const options = mergeOptions(defaultOptions, opts);

    var selectors = [];

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
            inputString = file.contents.toString();
            selectors = styleClassSelectorsFromInput(inputString, selectors);
            result = createOutput(options, selectors);
            outBuffer = new Buffer(result);
            const aFile = new gutil.File();
            aFile.path = file.path;
            aFile.contents = outBuffer;
            callback(null, aFile);
        } else {
            console.error(new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
            callback();
        }
    });
};

// export the Method
module.exports = gulpCssScala;
