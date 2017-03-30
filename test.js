var assert = require('assert'),
    File = require('vinyl'),
    es = require('event-stream'),
    cssScala = require('./index.js');


describe('gulp-css-scala', function() {
    it('should be true', function(done) {
        true;
        done();
    });

    it('should return a scala object', function(){
        // create the fake file
        var fakeFile = new File({
            contents: new Buffer('.foo {color:red}'),
            path:'foo.css'
        });

        var myCssScala = cssScala();

        myCssScala.write(fakeFile);

        myCssScala.once('data', function(file) {

            assert(file.isBuffer());

            console.log(file.contents.toString('utf8'));

            done();
        });
    });

});