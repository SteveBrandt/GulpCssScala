'use strict';

var assert = require('assert'),
    rewire = require('rewire');

var cssScala = rewire('../index.js');

describe('logic spec', function() {
    describe('beautify', function() {
        it('should remove non class selectors', function() {
            var testSelectors = ['.foo', '#bar', '.baz'];

            var result = cssScala.__get__('beautify')(testSelectors).toString();

            assert.equal(result.includes('.foo'), true);
            assert.equal(result.includes('#bar'), false);
        });

        it('should remove doubled entries', function() {
            var testSelectors = ['.foo', '.bar', '.foo'];

            var result = cssScala.__get__('beautify')(testSelectors);

            assert.equal(result.indexOf('.foo'), result.lastIndexOf('.foo'));
        });
    });

    describe('normalizeInput', function() {
        it('should remove @media css definitions', function() {
            var mediaCss = '\n.fooStyle{color:red}body{color:blue}'
                         + '@media screen and (min-width: 480px) {'
                         + '  .bazStyle { background-color: lightgreen; }'
                         + '}'
                         + '@media print {\n'
                         + '  .quxStyle { background-color: lightgreen; }\n'
                         + '}\n'
                         + '/* comment file.scss */ '
                         + '.barStyle { color: green }\n';

            var result = cssScala.__get__('normalizeInput')(mediaCss);

            console.log(result);

            assert.equal(result.includes('.fooStyle'), true);
            assert.equal(result.includes('.fooStylebody'), false);
            assert.equal(result.includes('.barStyle'), true);
            assert.equal(result.includes('.bazStyle'), true);
            assert.equal(result.includes('.quxStyle'), true);
        });


        it('should remove css bodies', function() {
            var mediaCss = '\n.fooStyle { color:red }'
                         + '@media print {\n'
                         + '  .barStyle { background-color: lightgreen; }\n'
                         + '}'
                         + '.barStyle { color: green }\n';

            var result = cssScala.__get__('normalizeInput')(mediaCss);

            assert.equal(result.includes('.fooStyle'), true);
            assert.equal(result.includes('color'), false);
            assert.equal(result.indexOf('{'), -1);
            assert.equal(result.indexOf('}'), -1);
        });
    });

    describe('styleClassSelectorsFromInput', function() {

        it('should return class selectors', function() {
            var css = '\n.fooStyle { color:red }\n'
                + 'div#baz { color:green }\n'
                + '@media screen and (min-width: 480px) {\n'
                + '  body { background-color: lightgreen; }\n'
                + '}\n'
                + '.barStyle { color: green }\n';

            var result = cssScala.__get__('styleClassSelectorsFromInput')(css, []);

            assert.equal(result[0], '.barStyle' );
            assert.equal(result[1], '.fooStyle' );
        });
    });

    describe('normalizeSelector', function() {

        var camelCaseTests = [
            { input: 'foobar', expected: 'foobar' },
            { input: 'fooBar', expected: 'foobar' },
            { input: 'FooBar', expected: 'foobar' },
            { input: 'foo_bar_baz', expected: 'fooBarBaz' },
            { input: 'foo-bar-baz', expected: 'fooBarBaz' },
            { input: 'FOO-BAR_BAZ', expected: 'fooBarBaz' },

            // Not realistic, just to test correct behaviour of algorithm
            { input: 'f-o_o-b_a-r-', expected: 'fOOBAR' },
            { input: 'f-_-oo', expected: 'fOo' }
        ];

        camelCaseTests.forEach(function(test) {
            it('should return selector "' + test.input + '" in lowerCamelCase', function() {
                assert.equal(cssScala.__get__('normalizeSelector')(test.input,
                    { replaceForDashDash: 'As', replaceForUnderlineUnderline: 'Child' }), test.expected);
            });
        });

        var hierachyTests = [
            { input: 'foo--bar', expected: 'fooAsBar' },
            { input: 'foo--bar--baz', expected: 'fooAsBarAsBaz' },
            { input: 'foo__bar', expected: 'fooChildBar' },
            { input: 'foo__bar__baz', expected: 'fooChildBarChildBaz' },
            { input: 'foo--bar__baz--void', expected: 'fooAsBarChildBazAsVoid' },
            { input: 'foo__bar--baz__void', expected: 'fooChildBarAsBazChildVoid' }
        ];

        hierachyTests.forEach(function(test) {
            it('should return selector "' + test.input + '" respecting css hierachy (As, With)', function() {
                assert.equal(cssScala.__get__('normalizeSelector')(test.input,
                    { replaceForDashDash: 'As', replaceForUnderlineUnderline: 'Child' }), test.expected);
            });
        });
    });

    describe('createOutput', function() {
        it('should return a valid scala object', function() {

            var result = cssScala.__get__('createOutput')({
                    packageName:'com.example.css',
                    objectName:'Css' },
                ['.foo']);

            var expectedObject = 'package com.example.css\n' +
                '\n// File is generated by gulp-css-scala\n' +
                '\nobject Css {\n' +
                '  val foo: String = "foo"\n' +
                '}';

            assert.equal(result, expectedObject);
        });
    });
});
