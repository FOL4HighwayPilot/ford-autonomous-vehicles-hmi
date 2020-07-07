"use strict";

if (typeof TextDecoder === 'undefined') {
  module.exports = require('text-encoding');
} else {
  module.exports = {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder
  };
}
//# sourceMappingURL=text-encoding.js.map