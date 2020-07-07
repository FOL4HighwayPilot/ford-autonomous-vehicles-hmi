"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packBinaryJson = packBinaryJson;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _utils = require("../../utils");

function packBinaryJsonTypedArray(gltfBuilder, object, objectKey, info) {
  if (gltfBuilder.isImage(object)) {
    var imageIndex = gltfBuilder.addImage(object);
    return "#/images/".concat(imageIndex);
  }

  var opts = info && info.size ? {
    size: info.size
  } : {
    size: 3
  };
  var bufferIndex = gltfBuilder.addBuffer(object, opts);
  return "#/accessors/".concat(bufferIndex);
}

function packBinaryJson(json, gltfBuilder) {
  var objectKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$flattenArray = options.flattenArrays,
      flattenArrays = _options$flattenArray === void 0 ? true : _options$flattenArray;
  var object = json;
  var objectInfo = null;

  if (typeof object === 'string' && object.indexOf('#/') === 0) {
    return "#".concat(object);
  }

  if (Array.isArray(object)) {
    var flatObject = flattenArrays && flattenObject(objectKey, object);

    if (flatObject) {
      object = flatObject.typedArray;
      objectInfo = flatObject;
    } else {
      return object.map(function (element) {
        return packBinaryJson(element, gltfBuilder, options);
      });
    }
  }

  if (ArrayBuffer.isView(object) && gltfBuilder) {
    return packBinaryJsonTypedArray(gltfBuilder, object, objectKey, objectInfo);
  }

  if (object !== null && (0, _typeof2["default"])(object) === 'object') {
    var newObject = {};

    for (var key in object) {
      newObject[key] = packBinaryJson(object[key], gltfBuilder, key, options);
    }

    return newObject;
  }

  return object;
}

function flattenObject(key, object) {
  var typedArray = null;
  var size = 3;

  if (key === 'vertices' || key === 'points') {
    typedArray = (0, _utils.flattenToTypedArray)(object, size, Float32Array);
  }

  if (key === 'colors') {
    size = object[0].length === 4 ? 4 : 3;
    typedArray = (0, _utils.flattenToTypedArray)(object, size, Uint8Array);
  }

  if (typedArray) {
    return {
      typedArray: typedArray,
      size: size
    };
  }

  return null;
}
//# sourceMappingURL=xviz-pack-binary.js.map