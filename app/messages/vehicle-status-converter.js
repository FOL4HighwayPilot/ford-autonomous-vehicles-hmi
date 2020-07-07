import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

export class SensorVelAcc extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'SensorVelAcc';
  }

  static get messageType() {
    return 'carla_msgs/CarlaEgoVehicleStatus';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    const {timestamp, message} = data[data.length - 1];
    const {
      velocity: v,
      acceleration: {
        linear: {x, y, z}
      }
    } = message;
    //console.log(v);
    const vel = v;
    const accel = Math.sqrt(x * x + y * y + z * z);

    xvizBuilder
      .timeSeries('/vehicle/velocity')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .value(vel);

      xvizBuilder
      .timeSeries('/vehicle/acceleration')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .value(accel);
  }

  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream('/vehicle/velocity')
      .category('time_series')
      .type('float')
      .unit('m/s')

      .stream('/vehicle/acceleration')
      .category('time_series')
      .type('float')
      .unit('m/s^2');
  }
}