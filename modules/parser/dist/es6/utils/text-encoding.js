if (typeof TextDecoder === 'undefined') {
  module.exports = require('text-encoding');
} else {
  module.exports = {
    TextEncoder,
    TextDecoder
  };
}
//# sourceMappingURL=text-encoding.js.map