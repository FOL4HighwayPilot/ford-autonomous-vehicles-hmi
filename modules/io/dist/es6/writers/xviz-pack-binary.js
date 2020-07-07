import { flattenToTypedArray } from './flatten';

function packBinaryJsonTypedArray(gltfBuilder, object, objectKey, info) {
  if (gltfBuilder.isImage(object)) {
    const imageIndex = gltfBuilder.addImage(object);
    return "#/images/".concat(imageIndex);
  }

  const opts = info && info.size ? {
    size: info.size
  } : {
    size: 3
  };
  const bufferIndex = gltfBuilder.addBuffer(object, opts);
  return "#/accessors/".concat(bufferIndex);
}

export function packBinaryJson(json, gltfBuilder, objectKey = null, options = {}) {
  const {
    flattenArrays = true
  } = options;
  let object = json;
  let objectInfo = null;

  if (typeof object === 'string' && object.indexOf('#/') === 0) {
    return "#".concat(object);
  }

  if (Array.isArray(object)) {
    const flatObject = flattenArrays && flattenObject(objectKey, object);

    if (flatObject) {
      object = flatObject.typedArray;
      objectInfo = flatObject;
    } else {
      return object.map(element => packBinaryJson(element, gltfBuilder, options));
    }
  }

  if (ArrayBuffer.isView(object) && gltfBuilder) {
    return packBinaryJsonTypedArray(gltfBuilder, object, objectKey, objectInfo);
  }

  if (object !== null && typeof object === 'object') {
    const newObject = {};

    for (const key in object) {
      newObject[key] = packBinaryJson(object[key], gltfBuilder, key, options);
    }

    return newObject;
  }

  return object;
}

function flattenObject(key, object) {
  let typedArray = null;
  let size = 3;

  if (key === 'vertices' || key === 'points') {
    typedArray = flattenToTypedArray(object, size, Float32Array);
  }

  if (key === 'colors') {
    size = object[0].length === 4 ? 4 : 3;
    typedArray = flattenToTypedArray(object, size, Uint8Array);
  }

  if (typedArray) {
    return {
      typedArray,
      size
    };
  }

  return null;
}
//# sourceMappingURL=xviz-pack-binary.js.map