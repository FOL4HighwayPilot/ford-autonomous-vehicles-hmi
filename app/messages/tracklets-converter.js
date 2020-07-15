import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

export class TrackletsConverter extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'TrackletsConverter';
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
      .primitive('/tracklets/objects')
      .polygon([pos[0], pos[1], pos[2]])
      .classes(['Car'])
      .style({
        height: 2
      })
      .id('217');
    
    xvizBuilder
      .primitive('/tracklets/tracking_points')
      .circle([pos[0], pos[1], pos[2]])
      .id('217');

    xvizBuilder
      .primitive('tracklets/labels')
      .position([pos[0], pos[1], pos[2] + 2])
      .text('217');
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
      .stream('/tracklets/objects')
      .category('primitive')
      .type('polygon')
      .streamStyle({
        extruded: true,
        wireframe: true,
        fill_color: '#00000080'
      })
      .styleClass('Car', {
        fill_color: '#50B3FF20',
        stroke_color: '#50B3FF30'
      })
      //.coordinate('VEHICLE_RELATIVE')
      .pose()
      
      .stream('/tracklets/tracking_points')
      .category('primitive')
      .type('circle')
      .streamStyle({
        radius: 0.2,
        stroke_width: 0,
        fill_color: '#FFC043'
      })

      .stream('/tracklets/labels')
      .category('primitive')
      .type('text')
      .streamStyle({
        text_size: 18,
        fill_color: '#DCDCCD'
      });
  }
}