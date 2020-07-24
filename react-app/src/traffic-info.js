import React, {PureComponent} from 'react';
import {_BaseWidget as BaseWidget, TrafficLightWidget} from 'streetscape.gl';

const TRAFFIC_LIGHT_STYLE = {
    light: {
      height: 50,
      width: 50
    },
    wrapper: {
        padding: 20
    }
};

export default class TrafficInfo extends PureComponent {

    _renderRoadInfo({streams}) {
        var road = "Tunnel in 0.5km"
        if (road == 'unknown') {
          road = "Unspecified" 
        }
        return (
          <div className="road-state" style={{background: '#5B91F4'}}>
            {road}
          </div>
        );
      }

      _renderRoadInfo2({streams}) {
        var road = "Exit Ramp in 2km"
        if (road == 'unknown') {
          road = "Unspecified" 
        }
        return (
          <div className="road-state" style={{background: '#5B91F4'}}>
            {road}
          </div>
        );
      }

      _renderRoadInfo3({streams}) {
        var road = "Destination in 5km"
        if (road == 'unknown') {
          road = "Unspecified" 
        }
        return (
          <div className="road-state" style={{background: '#5B91F4'}}>
            {road}
          </div>
        );
      }

      _renderRoadSigns({streams}) {
        var sign = 'tunnel';
        return (
          <div>
            {<img src={"../assets/traffic-sign-"+ sign +".png"} alt="Traffic-Sign-Image" className="traffic-sign-image" />}
          </div>
        );
      }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center', paddingBottom: '10px'}}>
              <div style={{paddingLeft: '12px'}}>
              <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/road_info'}}>
                  {this._renderRoadInfo}
              </BaseWidget>
              <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/road_info'}}>
                  {this._renderRoadInfo2}
              </BaseWidget>
              <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/road_info'}}>
                  {this._renderRoadInfo3}
              </BaseWidget>
              </div>
              <div>
              <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/road_info'}}>
                    {this._renderRoadSigns}
              </BaseWidget>
              </div>
            </div>
        );
    }
}

// <TrafficLightWidget log={this.props.log} streamName="/vehicle/traffic_light" style={TRAFFIC_LIGHT_STYLE} />