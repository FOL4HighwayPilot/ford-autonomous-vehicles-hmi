import Converter from './converter';
import sharp from 'sharp';

export class SensorImage extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'SensorImage';
  }

  static get messageType() {
    return 'sensor_msgs/Image';
  }

  async convertMessage(frame, xvizBuilder) {
    const msgs = frame[this.topic];
    if (!msgs) {
      return;
    }

    if (msgs.length) {
      const {message} = msgs[msgs.length - 1];
      const {width, height, /* encoding, step, */ data} = message;

      // TODO: encoding should be handled properly instead of assuming a 3 channel image.
      // http://docs.ros.org/jade/api/sensor_msgs/html/image__encodings_8h_source.html

      const imgData = await sharp(data, {
        raw: {
          width,
          height,
          channels: 3
        }
      })
        .resize(400)
        .toFormat('png')
        .toBuffer();

      xvizBuilder
        .primitive(this.xvizStream)
        .image(nodeBufferToTypedArray(imgData), 'png')
        .dimensions(width, height);
    }
  }

  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.xvizStream)
      .category('primitive')
      .type('image');
  }
}

function nodeBufferToTypedArray(buffer) {
  // TODO - per docs we should just be able to call buffer.buffer, but there are issues
  const typedArray = new Uint8Array(buffer);
  return typedArray;
}