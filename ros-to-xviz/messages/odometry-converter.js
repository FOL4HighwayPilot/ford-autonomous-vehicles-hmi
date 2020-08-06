import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

export class SensorOdometry extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'SensorOdometry';
  }

  static get messageType() {
    return 'nav_msgs/Odometry';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    const {timestamp, message} = data[data.length - 1];

    // Read Position
    var {
      pose: {
        pose: {
          position: {x, y, z}
        }
      }
    } = message;
    const pos = [x, y, z];
    //console.log(pos);

    // Read Orientation
    var {
      pose: {
        pose: {
          orientation: {x, y, z, w}
        }
      }
    } = message;

    // Convert orientation (from Quaternions to Roll-Pitch-Yaw)
    const roll = Math.atan2(2*x*w + 2*y*z, 1 - 2*x*x - 2*y*y);
    const pitch =  Math.asin(2*w*y + 2*z*x);
    const yaw = Math.atan2(2*z*w + 2*x*y, 1 - 2*y*y - 2*z*z);
    //console.log([roll, pitch, yaw]);

    xvizBuilder
      .pose('/vehicle_pose')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .mapOrigin(29.008258, 41.045199, 0)
      .orientation(roll, pitch, yaw)
      .position(pos[0], pos[1], pos[2]);
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
      .stream('/vehicle_pose')
      .category('pose');
  }
}