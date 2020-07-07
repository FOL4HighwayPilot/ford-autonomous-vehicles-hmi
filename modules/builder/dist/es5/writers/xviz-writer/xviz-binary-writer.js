"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeBinaryXVIZ = encodeBinaryXVIZ;
exports.writeBinaryXVIZtoFile = writeBinaryXVIZtoFile;
exports.XVIZ_GLTF_EXTENSION = void 0;

require("@loaders.gl/polyfills");

var _gltf = require("@loaders.gl/gltf");

var _xvizPackBinary = require("./xviz-pack-binary");

var XVIZ_GLTF_EXTENSION = 'AVS_xviz';
exports.XVIZ_GLTF_EXTENSION = XVIZ_GLTF_EXTENSION;

function encodeBinaryXVIZ(xvizJson, options) {
  var gltfBuilder = new _gltf.GLTFBuilder(options);
  var packedData = (0, _xvizPackBinary.packBinaryJson)(xvizJson, gltfBuilder, null, options);
  var useAVSXVIZExtension = options.useAVSXVIZExtension;

  if (useAVSXVIZExtension === true) {
    gltfBuilder.addExtension(XVIZ_GLTF_EXTENSION, packedData, {
      nopack: true
    });
  } else {
    gltfBuilder.addApplicationData('xviz', packedData, {
      nopack: true
    });
  }

  return gltfBuilder.encodeAsGLB(options);
}

function writeBinaryXVIZtoFile(sink, directory, name, json, options) {
  var glbFileBuffer = encodeBinaryXVIZ(json, options);
  sink.writeSync(directory, "".concat(name, ".glb"), Buffer.from(glbFileBuffer), {
    flag: 'w'
  });
  return glbFileBuffer;
}
//# sourceMappingURL=xviz-binary-writer.js.map