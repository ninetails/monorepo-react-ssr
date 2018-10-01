"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serverRenderer;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serverRenderer() {
  return function (req, res, next) {
    res.status(200).send("\n      <!doctype html>\n      <html>\n      <head>\n        <title>App</title>\n      </head>\n      <body>\n        <div id=\"root\">\n          ".concat((0, _server.renderToString)(_react.default.createElement(_App.default, null)), "\n        </div>\n        <script src=\"/client.js\"></script>\n      </body>\n      </html>\n    "));
  };
}
//# sourceMappingURL=server.js.map