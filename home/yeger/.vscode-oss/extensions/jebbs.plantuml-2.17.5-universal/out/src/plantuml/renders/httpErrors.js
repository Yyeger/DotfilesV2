"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = exports.HTTPErrorType = void 0;
var HTTPErrorType;
(function (HTTPErrorType) {
    HTTPErrorType[HTTPErrorType["ResponeError"] = 0] = "ResponeError";
    HTTPErrorType[HTTPErrorType["NetworkError"] = 1] = "NetworkError";
    HTTPErrorType[HTTPErrorType["PlantUMLError"] = 2] = "PlantUMLError";
})(HTTPErrorType = exports.HTTPErrorType || (exports.HTTPErrorType = {}));
class HTTPError {
    constructor(err, type, code) {
        this._err = err;
        this._type = type;
        this._code = code;
    }
    get name() {
        return this._err.name;
    }
    get message() {
        return this._err.message;
    }
    get stack() {
        return this._err.stack;
    }
    get originalError() {
        return this._err;
    }
    get isResponeError() {
        return this._type === HTTPErrorType.ResponeError;
    }
    get isNetworkError() {
        return this._type === HTTPErrorType.NetworkError;
    }
    get isPlantUMLError() {
        return this._type === HTTPErrorType.PlantUMLError;
    }
    isHTTPCode(code) {
        return code === this._code;
    }
}
exports.HTTPError = HTTPError;
//# sourceMappingURL=httpErrors.js.map