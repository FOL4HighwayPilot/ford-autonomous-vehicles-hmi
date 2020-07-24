import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const BEHAVIOR_STATE = {
    'MaintainSpeed': 'Maintaining Speed',
    'ChangeToLeftLane': 'Changing to Left Lane',
    'ChangeToRightLane': 'Changing to Right Lane',
    'CheckLeftLane': 'Checking Left Lane',
    'CheckRightLane': 'Checking Right Lane'
};

export class SensorBehaviorState extends Converter {
    constructor(config) {
      super(config);
    }
  
    static get name() {
      return 'SensorBehaviorState';
    }
  
    static get messageType() {
      return 'std_msgs/String';
    }
  
    async convertMessage(frame, xvizBuilder) {
      const data = frame[this.topic];
      if (!data) {
        return;
      }
  
      const {timestamp, message} = data[data.length - 1];
      var {
        data: state,
      } = message;
      state = BEHAVIOR_STATE[hex2a(state.toString('hex')).replace(/^\s+|\s+$/g, '')];
      //console.log(state)

      xvizBuilder
        .timeSeries('/vehicle/behavior_state')
        .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
        .value(state);
    }
  
    getMetadata(xvizMetaBuilder) {
      const xb = xvizMetaBuilder;
      xb.stream('/vehicle/behavior_state')
        .category('time_series')
        .type('String');
    }
  }