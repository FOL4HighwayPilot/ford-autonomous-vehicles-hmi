import {Converter} from '@xviz/ros';
import {TimeUtil} from 'rosbag';
import {_getPoseTrajectory as getPoseTrajectory} from '@xviz/builder';
import _ from 'lodash';
import {VisualizationMarkerArray} from './visualization-markerarray-converter';

export class NavPathForward extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'NavPathForward';
  }

  static get messageType() {
    return 'nav_msgs/Path';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    for (const d of data) {
        const polyline = d.message.poses.map(p => {
          const {position} = p.pose;
          return [position.x, position.y, 0];
        });
  
        xvizBuilder.primitive('/vehicle/nav_path_forward').polyline(polyline);
    }   
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
        .stream('/vehicle/nav_path_forward')
        .coordinate('IDENTITY')
        .category('primitive')
        .type('polyline')
        .streamStyle({
            stroke_color: '#57AD57AA',
            stroke_width: 1.4,
            stroke_width_min_pixels: 1
        });
  }
}

/******************************************************************** */

export class NavPathBackward extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'NavPathBackward';
  }

  static get messageType() {
    return 'nav_msgs/Path';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    for (const d of data) {
        const polyline = d.message.poses.map(p => {
          const {position} = p.pose;
          return [position.x, position.y, 0];
        });
  
        xvizBuilder.primitive('/vehicle/nav_path_backward').polyline(polyline);
    }   
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
        .stream('/vehicle/nav_path_backward')
        .coordinate('IDENTITY')
        .category('primitive')
        .type('polyline')
        .streamStyle({
            stroke_color: '#B3052533',
            stroke_width: 1.4,
            stroke_width_min_pixels: 1
        });
  }
}

/******************************************************************** */

export class NavPath extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'NavPath';
  }

  static get messageType() {
    return 'nav_msgs/Path';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    for (const d of data) {
        const polyline = d.message.poses.map(p => {
          const {position} = p.pose;
          return [position.x, position.y, 0];
        });
  
        xvizBuilder.primitive('/vehicle/nav_path').polyline(polyline);
    }   
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
        .stream('/vehicle/nav_path')
        .coordinate('IDENTITY')
        .category('primitive')
        .type('polyline')
        .streamStyle({
            stroke_color: '#F3F6A2AA',
            stroke_width: 1.4,
            stroke_width_min_pixels: 1
        });
  }
}

/******************************************************************** */

export class NavPathDecided extends Converter {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'NavPathDecided';
  }

  static get messageType() {
    return 'nav_msgs/Path';
  }

  async convertMessage(frame, xvizBuilder) {
    const data = frame[this.topic];
    if (!data) {
      return;
    }

    for (const d of data) {
        const polyline = d.message.poses.map(p => {
          const {position} = p.pose;
          return [position.x, position.y, 0];
        });
  
        xvizBuilder.primitive('/vehicle/nav_path_decided').polyline(polyline);
    }   
  }

  getMetadata(xvizMetaBuilder) {
    xvizMetaBuilder
        .stream('/vehicle/nav_path_decided')
        .coordinate('IDENTITY')
        .category('primitive')
        .type('polyline')
        .streamStyle({
            stroke_color: '#57AD57AA',
            stroke_width: 1.4,
            stroke_width_min_pixels: 1
        });
  }
}

/******************************************************************** */

export class NavPathFilteredMarker extends VisualizationMarkerArray {
  constructor(config) {
    super(config);
  }

  static get name() {
    return 'NavPathFilteredMarker';
  }

  static get messageType() {
    return 'visualization_msgs/Marker';
  }

  async convertMessage(frame, xvizBuilder) {
    const messages = frame[this.topic];
    if (messages) {
      const markers = _.map(messages, 'message');
      markers.forEach(marker => this._processMarker(marker));
    }

    this.writeMarkers(xvizBuilder);
  }
}