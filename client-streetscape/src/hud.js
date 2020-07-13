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
import {_BaseWidget as BaseWidget, TurnSignalWidget, MeterWidget} from 'streetscape.gl';

const wheelImageLocation = "../assets/wheel3.png";

const WHEEL_WIDGET_STYLE = {
  arcRadius: 0,
  msrValue: {
    fontSize: 18,
    fontWeight: 700,
    paddingTop: 0
  },
  units: {
    fontSize: 14
  }
};

const METER_WIDGET_STYLE = {
  arcRadius: 42,
  msrValue: {
    fontSize: 18,
    fontWeight: 700,
    paddingTop: 3
  },
  units: {
    fontSize: 14
  }
};

const TURN_SIGNAL_WIDGET_STYLE = {
  wrapper: {
    padding: 5
  },
  arrow: {
    height: 36
  }
};

const AUTONOMY_STATE = {
  autonomous: '#47B275',
  manual: '#5B91F4',
  error: '#F25138',
  unknown: '#E2E2E2'
};

export default class HUD extends PureComponent {
  _renderAutonomyState({streams}) {
    var state = (streams.state.data && streams.state.data.variable) || 'unknown';
    state = "autonomous";
    return (
      <div className="autonomy-state" style={{background: AUTONOMY_STATE[state]}}>
        {state}
      </div>
    );
  }

  _renderBehaviorState({streams}) {
    var state = (streams.state.data && streams.state.data.variable) || 'unknown';
    if (state == 'unknown') {
      state = "Unspecified Behavior" 
    }
    return (
      <div className="behavior-state" style={{background: '#5B91F4'}}>
        {state}
      </div>
    );
  }

  _renderSteeringWheel({streams}) {
    var angle = (streams.state.data && streams.state.data.variable) || 'unknown';
    var rot = {
      transform: `rotate(${angle}deg)`
    };
    return (
      <div style={rot}>
        {<img src={wheelImageLocation} alt="Wheel" className="wheel-image" />}
      </div>
    );
  }

  render() {
    const {log} = this.props;

    return (
      <div id="hud">
        <div className="hud-column">
          <BaseWidget log={log} streamNames={{state: '/vehicle/autonomy_state'}}>
            {this._renderAutonomyState}
          </BaseWidget>
          <BaseWidget log={log} streamNames={{state: '/vehicle/behavior_state'}}>
            {this._renderBehaviorState}
          </BaseWidget>
          <TurnSignalWidget
            log={log}
            style={TURN_SIGNAL_WIDGET_STYLE}
            streamName="/vehicle/turn_signal"
          />
        </div>
        <hr width='100px'/>
        <hr width='100px'/>
        <MeterWidget
          log={log}
          style={METER_WIDGET_STYLE}
          streamName="/vehicle/velocity"
          units="Speed"
          min={0}
          max={20}
        />
        <hr width='100px'/>
        <hr width='100px'/>
        <MeterWidget
          log={log}
          style={METER_WIDGET_STYLE}
          streamName="/vehicle/acceleration"
          units="Acceleration"
          min={-4}
          max={4}
        />
        <hr width='100px'/>
        <hr width='100px'/>
        <BaseWidget log={log} streamNames={{state: '/vehicle/wheel_angle'}}>
            {this._renderSteeringWheel}
        </BaseWidget>
        <MeterWidget
            log={log}
            style={WHEEL_WIDGET_STYLE}
            streamName="/vehicle/wheel_angle"
            units="Steering Angle"
            min={-180}
            max={180}
        />
      </div>
    );
  }
}
