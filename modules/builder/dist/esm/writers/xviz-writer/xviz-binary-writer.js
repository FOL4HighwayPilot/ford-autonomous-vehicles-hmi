export var XVIZ_GLTF_EXTENSION = 'AVS_xviz';
import '@loaders.gl/polyfills';
import { GLTFBuilder } from '@loaders.gl/gltf';
import { packBinaryJson } from './xviz-pack-binary';
export function encodeBinaryXVIZ(xvizJson, options) {
  var gltfBuilder = new GLTFBuilder(options);
  var packedData = packBinaryJson(xvizJson, gltfBuilder, null, options);
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
export function writeBinaryXVIZtoFile(sink, directory, name, json, options) {
  var glbFileBuffer = encodeBinaryXVIZ(json, options);
  sink.writeSync(directory, "".concat(name, ".glb"), Buffer.from(glbFileBuffer), {
    flag: 'w'
  });
  return glbFileBuffer;
}
//# sourceMappingURL=xviz-binary-writer.js.map