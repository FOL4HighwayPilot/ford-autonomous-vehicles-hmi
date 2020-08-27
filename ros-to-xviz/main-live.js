import {XVIZUIBuilder} from '@xviz/builder';
import {serverArgs} from '@xviz/server';
import {convertArgs, ROSBag, registerROSBagProvider} from '@xviz/ros';
import {XVIZBuilder, XVIZMetadataBuilder} from '@xviz/builder';
import {TimeUtil} from 'rosbag';

import {XVIZBinaryWriter} from '@xviz/io';
import {FileSink} from '@xviz/io/node';


function main() {
  
  const xvizBuilder = new XVIZBuilder();
  const xvizMetaBuilder = new XVIZMetadataBuilder();

  const rosnodejs = require('rosnodejs');
  rosnodejs.initNode('/my_node')
  .then(() => {
    console.log("Waiting for data...")
    
  });

  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/carla/ego_vehicle/odometry', 'nav_msgs/Odometry', (msg) => {

    var {
      header: {
        stamp: timestamp
      }
    } = msg;

    var {
      pose: {
        pose: {
          position: {x, y, z}
        }
      }
    } = msg;
    const pos = [x, y, z];

    var {
      pose: {
        pose: {
          orientation: {x, y, z, w}
        }
      }
    } = msg;

    // Convert orientation (from Quaternions to Roll-Pitch-Yaw)
    const roll = Math.atan2(2*x*w + 2*y*z, 1 - 2*x*x - 2*y*y);
    const pitch =  Math.asin(2*w*y + 2*z*x);
    const yaw = Math.atan2(2*z*w + 2*x*y, 1 - 2*y*y - 2*z*z);

    /*
    console.log();
    console.log('EGO timestamp: %j', timestamp);
    console.log('EGO position: %j', pos);
    console.log('EGO orientation: %j', [roll, pitch, yaw]);
    */

    xvizBuilder
      .pose('/vehicle_pose')
      .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
      .mapOrigin(8, 49, 0)
      .orientation(roll, pitch, yaw)
      .position(pos[0], pos[1], pos[2]);
    xvizMetaBuilder
      .stream('/vehicle_pose')
      .category('pose');

    console.log();
    const metadata = xvizMetaBuilder.getMetadata();
    console.log(metadata);
    const message = xvizBuilder.getMessage();
    console.log(JSON.stringify(message, null, 2));
  });
  /*
  const sub2 = nh.subscribe('/carla/vehicle/217/odometry', 'nav_msgs/Odometry', (msg) => {

    var {
      header: {
        stamp: timestamp
      }
    } = msg;

    var {
      pose: {
        pose: {
          position: {x, y, z}
        }
      }
    } = msg;
    const pos = [x, y, z];

    var {
      pose: {
        pose: {
          orientation: {x, y, z, w}
        }
      }
    } = msg;

    // Convert orientation (from Quaternions to Roll-Pitch-Yaw)
    const roll = Math.atan2(2*x*w + 2*y*z, 1 - 2*x*x - 2*y*y);
    const pitch =  Math.asin(2*w*y + 2*z*x);
    const yaw = Math.atan2(2*z*w + 2*x*y, 1 - 2*y*y - 2*z*z);
    const orient = [pitch, yaw, roll]

    //console.log();
    //console.log('217 timestamp: %j', timestamp);
    //console.log('217 position: %j', pos);
    //console.log('217 orientation: %j', [roll, pitch, yaw]);

    xvizBuilder
      .primitive('/tracklets/objects')
      .polygon([pos, orient])
      .classes(['Car'])
      .style({height: 2})
      .id('217');
    xvizBuilder
      .primitive('/tracklets/tracking_points')
      .circle([pos[0], pos[1], pos[2]])
      .id('217');
    xvizBuilder
      .primitive('tracklets/labels')
      .position([pos[0], pos[1], pos[2] + 1])
      .text('217');

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
      .styleClass('Cyclist', {
        fill_color: '#DA70BF60',
        stroke_color: '#DA70BF'
      })
      .styleClass('Pedestrian', {
        fill_color: '#FEC56460',
        stroke_color: '#FEC564'
      })
      .styleClass('Van', {
        fill_color: '#267E6360',
        stroke_color: '#267E63'
      })
      .styleClass('Unknown', {
        fill_color: '#D6A00060',
        stroke_color: '#D6A000'
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

    console.log();
    const metadata = xvizMetaBuilder.getMetadata();
    console.log(metadata);
    const message = xvizBuilder.getMessage();
    console.log(JSON.stringify(message, null, 2));
  });
  */
}

main();