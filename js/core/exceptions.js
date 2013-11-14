/**
 * Created by yenn on 11/13/13.
 */

var APP = APP || {};
APP.exception = {};


APP.exception.CustomException = function(message) {
    this.type = "CustomException";
    this.name = "CustomException";
    this.message = message;
}
APP.exception.CustomException.prototype.toString = function() {
        return "["+this.name+"] " + this.message;
}


APP.exception.LibraryNotFound = function(message) {
    this.name = "LibraryNotFound";
    this.message = message;
};
APP.exception.LibraryNotFound.prototype = new APP.exception.CustomException();


APP.exception.NotSupported = function(message) {
    this.name = "NotSupported";
    this.message = message;
};
APP.exception.NotSupported.prototype = new APP.exception.CustomException();


APP.exception.TranslationError = function(code, details) {
    this.name = "TranslationError";
    this.code = parseInt(code);
    switch(code) {
        case 400:
            this.message = "Bad parameters. A compulsory argument is missing, or there is an argument with wrong format."
            break;
        case 451:
            this.message = "Not supported pair. The translation engine can't translate with the requested language pair.";
            break;
        case 452:
            this.message = "Not supported format. The translation engine doesn't recognize the requested format.";
            break;
        case 500:
            this.message = "Unexpected error. An unexpected error happened.";
            break;
        case 552:
            this.message = "The traffic limit for your IP or your user has been reached."
            break;
        default:
            this.message = "Unspecified error occurred. We are deeply sorry for the inconvenience"
    }
};
APP.exception.TranslationError.prototype = new APP.exception.CustomException();
APP.exception.TranslationError.prototype.getCode = function() {
    return this.code;
}


