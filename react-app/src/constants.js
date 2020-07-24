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
import {CarMesh} from 'streetscape.gl';
import {load} from '@loaders.gl/core';
import {OBJLoader} from '@loaders.gl/obj';

/* eslint-disable camelcase */
export const MAPBOX_TOKEN = "pk.eyJ1IjoiYWxpZWtpbmd1cmdlbiIsImEiOiJja2M0OWd2emswNXIxMnJudWtudXE2ZW1sIn0.yRXEAc_QKsX-rEZ_-XKDfw"
// "pk.eyJ1IjoiYWxpZWtpbmd1cmdlbiIsImEiOiJja2M0OWRlNDgwMnU2MnBxczI5cGR4cXdoIn0.TANnvg14GaRaY9ndnmrtgQ"
//process.env.MapboxAccessToken; // eslint-disable-line

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11';


export const XVIZ_CONFIG = {
  PLAYBACK_FRAME_RATE: 10
};

export const CAR = CarMesh.sedan({
  origin: [1.08, -0.32, 0],
  length: 4.3,
  width: 2.2,
  height: 1.5,
  color: [19, 58, 124]
});


export const TRUCK = {
  mesh: load('./assets/truck.obj', OBJLoader),
  origin: [1.08, -0.05, 0],
  scale: 0.009,
  //scale: 0.9,
  wireframe: false,
  color: [19, 58, 124]
};

export const APP_SETTINGS = {
  viewMode: {
    type: 'select',
    title: 'View Mode',
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'}
  },
  showTooltip: {
    type: 'toggle',
    title: 'Show Tooltip'
  },
  showDebug: {
    type: 'toggle',
    title: 'Show Debug Stats'
  }
};

export const XVIZ_STYLE = {
  '/tracklets/objects': [{name: 'selected', style: {fill_color: '#ff8000aa'}}],
  '/lidar/points': [{style: {point_color_mode: 'ELEVATION'}}]
};

export const STYLES = {
  PERF: {fontFamily: '"Helvetica Neue",arial,sans-serif', fontSize: 12}
};


/*
export const SETTINGS = {
  viewMode: {
    type: 'select',
    title: 'View Mode',
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'}
  }
};
*/
// LOG_DIR is defined in webpack.config.js
/* eslint-disable no-undef */
/*
export const LOGS = [
  {
    name: '2020-06-26-19-36-23',
    path: `../../../../2020-06-26-19-36-23`,
    xvizConfig: {
      TIME_WINDOW: 0.4
    },
    videoAspectRatio: 10 / 3
  },
  {
    name: 'nuTonomy-0006',
    path: `${LOG_DIR}/nutonomy/scene-0006`,
    xvizConfig: {
      TIME_WINDOW: 0.2,
      PLAYBACK_FRAME_RATE: 16
    },
    videoAspectRatio: 16 / 9
  }
];

export const MOBILE_NOTIFICATION = {
  id: 'mobile',
  message: 'Streetscape.gl demo can not run on mobile devices.'
};
*/