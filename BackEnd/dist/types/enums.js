"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_RESPONSE_STATUS = void 0;
var HTTP_RESPONSE_STATUS;
(function (HTTP_RESPONSE_STATUS) {
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["OK"] = 200] = "OK";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Created"] = 201] = "Created";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Accepted"] = 202] = "Accepted";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["No_Content"] = 204] = "No_Content";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Bad_Request"] = 400] = "Bad_Request";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Unauthorized"] = 401] = "Unauthorized";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Forbidden"] = 403] = "Forbidden";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Not_Found"] = 404] = "Not_Found";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Internal_Server_Error"] = 500] = "Internal_Server_Error";
    HTTP_RESPONSE_STATUS[HTTP_RESPONSE_STATUS["Unprocessable_Entity"] = 422] = "Unprocessable_Entity";
})(HTTP_RESPONSE_STATUS = exports.HTTP_RESPONSE_STATUS || (exports.HTTP_RESPONSE_STATUS = {}));
