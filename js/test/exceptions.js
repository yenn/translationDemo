var assert = require("assert");

describe('APP.exception.TranslationError', function(){
    describe('#()', function(){
        it('should return correct error message and code', function(){
            var exception = new APP.exception.TranslationError(400);
            assert.equal(exception.getCode(), 400);
            assert.equal(exception.toString(), "[TranslationError] Bad parameters. A compulsory argument is missing, or there is an argument with wrong format.");
        });
    });
});