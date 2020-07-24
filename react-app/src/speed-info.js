import React, {PureComponent} from 'react';
import {_BaseWidget as BaseWidget, MeterWidget} from 'streetscape.gl';

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

export default class SpeedInfo extends PureComponent {

    _renderSpeedLimit({streams}) {
        var limit = 110;
        return (
          <div>
            {<img src={"../assets/speed-limit-"+ limit +".png"} alt="Speed-Limit-Image" className="speed-limit-image" />}
          </div>
        );
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center', paddingLeft: '10px', paddingRight: '10px', paddingTop:'10px' }}>
                <MeterWidget
                log={this.props.log}
                style={METER_WIDGET_STYLE}
                streamName="/vehicle/velocity"
                units="Speed"
                min={0}
                max={20}
                />
                <MeterWidget
                log={this.props.log}
                style={METER_WIDGET_STYLE}
                streamName="/vehicle/acceleration"
                units="Acceleration"
                min={-4}
                max={4}
                />
                <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/speed_limit'}}>
                    {this._renderSpeedLimit}
                </BaseWidget>
            </div>
        );
    }

}