"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeWorkers = initializeWorkers;
exports.parseXVIZMessage = parseXVIZMessage;

var _parseXvizMessageSync = require("./parse-xviz-message-sync");

var _serialize = require("./serialize");

var _parseXvizMessageWorkerfarm = require("./parse-xviz-message-workerfarm");

function initializeWorkers(_ref) {
  var worker = _ref.worker,
      _ref$maxConcurrency = _ref.maxConcurrency,
      maxConcurrency = _ref$maxConcurrency === void 0 ? 4 : _ref$maxConcurrency,
      _ref$capacity = _ref.capacity,
      capacity = _ref$capacity === void 0 ? null : _ref$capacity;
  (0, _parseXvizMessageWorkerfarm.initializeWorkerFarm)({
    worker: worker,
    maxConcurrency: maxConcurrency,
    capacity: capacity
  });
}

function parseXVIZMessage(_ref2) {
  var message = _ref2.message,
      onResult = _ref2.onResult,
      onError = _ref2.onError,
      debug = _ref2.debug,
      _ref2$worker = _ref2.worker,
      worker = _ref2$worker === void 0 ? false : _ref2$worker,
      _ref2$maxConcurrency = _ref2.maxConcurrency,
      maxConcurrency = _ref2$maxConcurrency === void 0 ? 4 : _ref2$maxConcurrency,
      _ref2$capacity = _ref2.capacity,
      capacity = _ref2$capacity === void 0 ? null : _ref2$capacity;

  if (worker) {
    if (!(0, _parseXvizMessageWorkerfarm.getWorkerFarm)()) {
      initializeWorkers({
        worker: worker,
        maxConcurrency: maxConcurrency,
        capacity: capacity
      });
    }

    var workerFarm = (0, _parseXvizMessageWorkerfarm.getWorkerFarm)();

    if (debug) {
      workerFarm.debug = debug;
    }

    var onMessage = function onMessage(data) {
      return onResult((0, _serialize.postDeserialize)(data));
    };

    workerFarm.process(message, onMessage, onError);
  } else {
    (0, _parseXvizMessageSync.parseXVIZMessageSync)(message, onResult, onError);
  }
}
//# sourceMappingURL=parse-xviz-message.js.map