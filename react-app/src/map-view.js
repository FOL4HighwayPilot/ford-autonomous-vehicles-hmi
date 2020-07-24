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


const OBJECT_ICONS = {
  Car: FaCar,
  Van: FaBus,
  Pedestrian: FaWalking,
  Cyclist: FaBicycle
};

const VIEW_STATE = {
    longitude: -122.39995,
    latitude: 37.80001,
    zoom: 22,
    pitch: 0,
    bearing: 0
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
  })
];

//*************************************************************************/

export default class MapView extends PureComponent {
  /* FOR CUSTOM 3D LAYER
  state = {
    mapGeoJsonUrl: null
  };

  componentDidMount() {
    // Attach event listener when new log data arrives
    this.props.log.on('update', this._onDataUpdate);
  }

  componentWillUnmount() {
    // Remove event listener
    this.props.log.off('update', this._onDataUpdate);
  }

  _onDataUpdate() {
    const frame = this.props.log.getCurrentFrame();
    // `getChunkIdFromLngLat` is a utility that returns the internal map id from [longitude, latitude]
    const chunkId = getChunkIdFromLngLat(frame.trackPosition);
    this.setState({mapGeoJsonUrl: `http://our.map.service/?chunk=${chunkId}`});
  }
  */

  _onViewStateChange = ({viewOffset}) => {
    this.props.onSettingsChange({viewOffset});
  };
  
  streamFilter(streamName) {
    // This prevents LogViewer from generating the default layer for this stream
    return streamName !== '/tracklets/objects';
  }
  
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
        viewMode={VIEW_MODE[settings.viewMode]}
        //viewState={VIEW_STATE}
        style={LOG_VIEWER_STYLE}
        viewOffset={settings.viewOffset}
        //viewOffset={{x: -10, y: -10, bearing: 0}}
        onViewStateChange={this._onViewStateChange}
        renderObjectLabel={renderObjectLabel}
        customLayers={customLayers}
        streamFilter={this.streamFilter}
      />
    );
  }
}
