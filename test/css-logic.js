'use strict';

var assert = require('assert'),
    rewire = require('rewire');

var cssScala = rewire('../index.js');

describe('cssScala logic', function() {
    xdescribe('beautify', function() {
        it('should ...', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

    xdescribe('normalizeInput', function() {
        it('should ...', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

    xdescribe('styleClassSelectorsFromInput', function() {
        xit('should ...', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

    describe('normalizeSelector', function() {
        var camelCaseTests = [
            {input: 'foobar', expected: 'foobar'},
            {input: 'fooBar', expected: 'foobar'},
            {input: 'FooBar', expected: 'foobar'},
            {input: 'foo_bar_baz', expected: 'fooBarBaz'},
            {input: 'foo-bar-baz', expected: 'fooBarBaz'},
            {input: 'FOO-BAR_BAZ', expected: 'fooBarBaz'},

            // Not realistic, just to test correct behaviour of algorithm
            {input: 'f-o_o-b_a-r-', expected: 'fOOBAR'},
            {input: 'f-_-oo', expected: 'fOo'},
        ];

        camelCaseTests.forEach(function(test) {
            it('should return selector "' + test.input + '" in lowerCamelCase', function() {
                assert.equal(cssScala.__get__('normalizeSelector')(test.input, {}), test.expected);
            });
        });

        var hierachyTests = [
            {input: 'foo--bar', expected: 'fooAsBar'},
            {input: 'foo--bar--baz', expected: 'fooAsBarAsBaz'},
            {input: 'foo__bar', expected: 'fooChildBar'},
            {input: 'foo__bar__baz', expected: 'fooChildBarChildBaz'},
            {input: 'foo--bar__baz--void', expected: 'fooAsBarChildBazAsVoid'},
            {input: 'foo__bar--baz__void', expected: 'fooChildBarAsBazChildVoid'},
        ];

        hierachyTests.forEach(function(test) {
            it('should return selector "' + test.input + '" respecting css hierachy (As, With)', function() {
                assert.equal(cssScala.__get__('normalizeSelector')(test.input, {}), test.expected);
            });
        });
    });

    xdescribe('createOutput', function() {
        it('should ...', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
