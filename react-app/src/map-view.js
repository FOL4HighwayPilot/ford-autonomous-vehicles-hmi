// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {PureComponent} from 'react';
import {LogViewer, VIEW_MODE} from 'streetscape.gl';
import {MAPBOX_TOKEN, MAP_STYLE, CAR, TRUCK} from './constants';
import {XVIZ_STYLE, LOG_VIEWER_STYLE} from './custom-styles';
import {FaCar, FaBicycle, FaWalking, FaBus} from "react-icons/fa";
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
//import {LaneLayer} from './map-layers/lane-layer';
import {SignLayer, TrafficLightLayer, LaneLayer} from '@streetscape.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core';

var myData = [];
getxml();
console.log("hey");
console.log(myData);

const OBJECT_ICONS = {
  Car: FaCar,
  Van: FaBus,
  Pedestrian: FaWalking,
  Cyclist: FaBicycle
};

const COLORS = {
  yellow: [255, 255, 0],
  white: [255, 255, 255],
  none: [0, 0, 0, 0]
};

//*************************************************************************/

function getxml() {
  const xml_string = require('./output_file.xml');

  const xml2js = require('xml2js');
  const parser = new xml2js.Parser({ attrkey: "ATTR" });

  parser.parseString(xml_string, function(error, result) {
      if(error === null) {
          for (var i = 0; i < 300; i++) {
            var path = [];
            for (var j = 0; j < result.commonRoad.lanelet[i].leftBound[0].point.length; j++) {
              path.push([parseFloat(result.commonRoad.lanelet[i].leftBound[0].point[j].x[0])/1, 
                      parseFloat(result.commonRoad.lanelet[i].leftBound[0].point[j].y[0])/1,
                      0])
            }
            myData.push({path});
          }
          for (var i = 0; i < 300; i++) {
            var path = [];
            for (var j = 0; j < result.commonRoad.lanelet[i].rightBound[0].point.length; j++) {
              path.push([parseFloat(result.commonRoad.lanelet[i].rightBound[0].point[j].x[0])/1, 
                      parseFloat(result.commonRoad.lanelet[i].rightBound[0].point[j].y[0])/1,
                      0])
            }
            myData.push({path});
          }
      }
      else {
          console.log(error);
      }
  });
}

//*************************************************************************/

const renderObjectLabel = ({id, object, isSelected}) => {
  const feature = object.getFeature('/tracklets/objects');

  if (!feature) {
    return isSelected && <b>{id}</b>;
  }

  //console.log()
  //console.log(feature);
  //console.log(feature.base.classes[0]);


  const {classes} = feature.base;

  if (isSelected) {
    //console.log("SELECTED NOW")
    return (
      <div>
        <div>
          <b>{id}</b>
        </div>
        <div>{classes.join(' ')}</div>
      </div>
    );
  }

  const objectType = classes && classes.join('');;
  if (objectType in OBJECT_ICONS) {
    //console.log(objectType);
    let ObjIcon = OBJECT_ICONS[objectType];
    return (
        <div>
            <ObjIcon size={16} color='black'/>
        </div>
    );
  }
  return null;
};

//*************************************************************************/

const signLayerProps = {
  coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
  coordinateOrigin: [7.99972, 49.0013],

  //coordinate: 'VEHICLE_RELATIVE',

  iconAtlas: './assets/speed-limit-110-sign.png',
  iconMapping: {
    stop: {x: 0, y: 0, width: 256, height: 256}
  },
  data: [
    {position: [-1, 1, 1], angle: 90}
  ],
  sizeScale: 2,

  getAngle: d => (d.angle / 180) * Math.PI,
  getIcon: d => 'stop',
  getSize: 1
};

const customLayers = [
  new SimpleMeshLayer({
    id: 'custom-objectModels',

    // Scatterplot layer render options
    getPosition: d => d.vertices.slice(0, 3),
    getOrientation: d => {return d.vertices.slice(3, 6);},
    getColor: [200, 128, 128],
    //onClick: d => d.base.classes[0],
    mesh: CAR.mesh,
    wireframe: false,

    // log-related options
    streamName: '/tracklets/objects',
    coordinate: 'VEHICLE_RELATIVE'
  }),

  new LaneLayer({
    id: 'lanes',
    coordinate: COORDINATE_SYSTEM.METER_OFFSETS,
    coordinateOrigin: [8, 49],
    //coordinateOrigin: [29.0081, 41.0465],

    data: myData,

    getPath: d => {console.log(d.path); return d.path;},
    getColor: [80, 200, 0],
    getColor2: [0, 128, 255],
    getWidth: [0.1, 0.05, 0.05],
    getDashArray: [4, 1, 1, 1]
  }),

  new TrafficLightLayer({
    id: 'traffic-lights',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    coordinateOrigin: [7.9997, 49.0011],
    //coordinateOrigin: [29.008, 41.0465],

    data: [
      {position: [0, 0, 1], angle: 70, color: 'red'},
      {position: [0, 0, 0.5], angle: 70, color: 'yellow'},
      {position: [0, 0, 0], angle: 70, color: 'green'},
      {position: [0, 0, -0.5], angle: 70, color: 'red', shape: 'left_arrow'},
      {position: [0, 0, -1], angle: 70, color: 'red', shape: 'right_arrow'}
    ],

    getPosition: d => d.position,
    getShape: d => d.shape || 'circular',
    getColor: d => d.color,
    getAngle: d => (d.angle / 180) * Math.PI,
    getState: 1
  }),

  new SignLayer({
    ...signLayerProps,
    id: 'sign-3d',
    render3D: true,
    getPosition: d => d.position
  }),
];

//*************************************************************************/

export default class MapView extends PureComponent {
  state = {
    viewState: {altitude: 1.5, bearing: -180, height: 603, latitude: 41.045199, longitude: 29.008258, 
          maxPitch: 85, maxZoom: 24, minPitch: 0, minZoom: 12, pitch: 60, transitionDuration: 0, width: 1920, zoom: 21},
    //{longitude: 29.008258, latitude: 41.045199, zoom: 20, pitch: 60, bearing: -180},
    viewOffset: {x: 0, y: 250, bearing: 0}
  };

  _onViewStateChange = ({viewOffset}) => {
    this.props.onSettingsChange({viewOffset});
  };
  
  streamFilter(streamName) {
    // This prevents LogViewer from generating the default layer for this stream
    return streamName !== '/tracklets/objects';
  }
  /*
  componentWillMount() {
    console.log("HEEY")
    this.recenterCamera();
  }
  */
  render() {
    const {log, settings} = this.props;

    return (  
      <LogViewer
        log={log}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        car={TRUCK}
        xvizStyles={XVIZ_STYLE}
        style={LOG_VIEWER_STYLE}
        showTooltip={settings.showTooltip}

        viewState={this.state.viewState}
        viewOffset={this.state.viewOffset}
        onViewStateChange={({viewState, viewOffset}) => this.setState({viewState, viewOffset})}

        viewMode={VIEW_MODE[settings.viewMode]}
        //viewState={VIEW_STATE}
        //onViewStateChange={this._onViewStateChange}
        renderObjectLabel={renderObjectLabel}
        customLayers={customLayers}
        streamFilter={this.streamFilter}
      />
    );
  }
}
