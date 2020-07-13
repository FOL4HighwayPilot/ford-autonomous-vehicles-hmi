import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';

const SIGNAL_STATE = {
    '6c656674': 'left',
    '7269676874': 'right',
    'both': 'both'
};

export class SensorTurnSignal extends Converter {
    constructor(config) {
      super(config);
    }
  
    static get name() {
      return 'SensorTurnSignal';
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
        data: signal,
      } = message;
      
      signal = SIGNAL_STATE[signal.toString('hex')];

      xvizBuilder
        .timeSeries('/vehicle/turn_signal')
        .timestamp(TimeUtil.toDate(timestamp).getTime() / 1e3)
        .value(signal);
    }
  
    getMetadata(xvizMetaBuilder) {
      const xb = xvizMetaBuilder;
      xb.stream('/vehicle/turn_signal')
        .category('time_series')
        .type('String');
    }
  }