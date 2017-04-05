'use strict';

const assert = require('assert'),
    gutil = require('gulp-util'),
    cssScala = require('../index'),
    fs = require('fs'),
    es = require('event-stream'),
    path = require('path');

describe('module spec', function() {

    const fakeFile = new gutil.File({
        path: 'foo.css',
        contents: new Buffer('.foo {color:blue}')
    });

    it('should generate a scala file', function(done) {
        const myCssScala = cssScala();

        myCssScala.write(fakeFile);

        myCssScala.once('data', function(file) {
            assert(file.isBuffer());

            const expectedObject = 'package com.example.css\n' +
                '\n// File is generated by gulp-css-scala\n' +
                '\nobject Css {\n' +
                '  val foo: String = "foo"\n' +
                '}';

            assert.equal(file.contents.toString(), expectedObject);
            done();
        });
    });

    it('should generate a scala file with custom options', function(done) {
        const myCssScala = cssScala({packageName:'my.package', objectName: 'MyObject'});

        myCssScala.write(fakeFile);

        myCssScala.once('data', function(file) {
            assert(file.isBuffer());

            const expectedObject = 'package my.package\n' +
                '\n// File is generated by gulp-css-scala\n' +
                '\nobject MyObject {\n' +
                '  val foo: String = "foo"\n' +
                '}';

            assert.equal(file.contents.toString(), expectedObject);
            done();
        });
    });
});