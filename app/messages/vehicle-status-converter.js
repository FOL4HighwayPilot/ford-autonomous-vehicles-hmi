import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

function convertToDegrees(s) {
  const max_steer_angle = 0.820305; // Specific to CARLA ego_vehicle
  s *= max_steer_angle;
  s *= 10; // CONFIRM ANGLE CONVERSION 
  return s * 180 / Math.PI;
}

export class SensorVelAccSteer extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'SensorVelAccSteer';
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
      },
      control: {
        steer: s
      }
    } = message;
    //console.log(v);
    const vel = v;
    const accel = Math.sqrt(x * x + y * y + z * z);
    const steer = convertToDegrees(s);
    //console.log(steer)

    xvizBuilder
      .timeSeries('/vehicle/velocity')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .value(vel);

    xvizBuilder
      .timeSeries('/vehicle/acceleration')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .value(accel);

    xvizBuilder
      .timeSeries('/vehicle/wheel_angle')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .value(steer);
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
      .unit('m/s^2')

      .stream('/vehicle/wheel_angle')
      .category('time_series')
      .type('float')
      .unit('degrees');
  }
}