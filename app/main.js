import {XVIZUIBuilder} from '@xviz/builder';
import {serverArgs} from '@xviz/server';
import {convertArgs, ROSBag, registerROSBagProvider} from '@xviz/ros';

import {SensorImage} from './messages/image-converter';
import {SensorVelAcc} from './messages/vehicle-status-converter';
import {SensorOdometry} from './messages/odometry-converter';
import {NavPathForward, NavPathBackward, NavPath, NavPathDecided, NavPathFilteredMarker} from './messages/waypoints-converter';
import {TrackletsConverter} from './messages/tracklets-converter'

export class CarlaBag extends ROSBag {
  constructor(bagPath, rosConfig) {
    super(bagPath, rosConfig);
  }

  getMetadata(builder, ros2xviz) {
    super.getMetadata(builder, ros2xviz);

    const ui = new XVIZUIBuilder({});

    // Cameras
    const SPECTATOR = "/carla/ego_vehicle/camera/spectator_view";
    const FRONT = "/carla/ego_vehicle/camera/front_view";

    const cam_panel = ui.panel({
      name: 'Camera'
    });

    const video = ui.video({
      cameras: [SPECTATOR, FRONT]
    });

    cam_panel.child(video);

    // Metric Charts
    const chart_panel = ui.panel({
      name: 'Charts'
    });

    const metricVel = ui.metric({
      streams: ['/vehicle/velocity'],
      title: 'Velocity',
      description: 'The velocity of the vehicle'
    });

    const metricAcc = ui.metric({
      streams: ['/vehicle/acceleration'],
      title: 'Acceleration',
      description: 'The acceleration of the vehicle'
    });

    chart_panel.child(metricVel);
    chart_panel.child(metricAcc);


    ui.child(cam_panel);
    ui.child(chart_panel);

    builder.ui(ui);
  }
}

// Setup ROS Provider
function setupROSProvider(args) {
  if (args.rosConfig) {
    const converters = [SensorOdometry, SensorVelAcc, SensorImage, TrackletsConverter, NavPathDecided, NavPathFilteredMarker];
    registerROSBagProvider(args.rosConfig, {converters, BagClass: CarlaBag});
  }
}

function main() {
  const yargs = require('yargs');

  let args = yargs.alias('h', 'help');

  args = convertArgs(args);
  args = serverArgs(args);

  // This will parse and execute the server command
  args.middleware(setupROSProvider).parse();
}

main();