import React, {PureComponent} from 'react';
import {_BaseWidget as BaseWidget} from 'streetscape.gl';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const driverImageLocation = "../assets/driver.png"
var score = 9;

const AUTONOMY_STATE = {
  autonomous: '#47B275',
  manual: '#5B91F4',
  error: '#F25138',
  unknown: '#E2E2E2'
};

export default class FatigueScore extends PureComponent {
  state = this.props.state;

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

  _renderFatigueScore() {

      //if (Math.random() < 0.05) {score += 1;}
  
      const header = "Driver Fatigue";
      return (
        <div className="fatigue-score">
          <div style={{width:'135px', paddingRight:'30px'}}>
          <CircularProgressbar value={100 - score*10} text="Fatigue"  width="20px"
          styles={buildStyles({
            pathColor: score >= 9 ? `rgba(255, 0, 0, ${score * 100})` : (score >= 7) ? "#FFA500" : "#13397c",
            textSize: "14px",
            textColor: "white"
          })} />
          </div>
        </div>
      );
    }

  render() {
      return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center', paddingBottom: '10px'}}>
          <div className="state-column">
            <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/autonomy_state'}}>
              {this._renderAutonomyState}
            </BaseWidget>
            <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/behavior_state'}}>
              {this._renderBehaviorState}
            </BaseWidget>
          </div>
          <div>
              <BaseWidget log={this.props.log} streamNames={{state: '/vehicle/behavior_state'}}>
                  {this._renderFatigueScore}
              </BaseWidget>
          </div>
        </div>
        
      );
  }

}

/*
{score >= 9 ?
          <div id="hud-warning">
            <img src={driverImageLocation} className='driver-image' />
            <div className="hud-row">
              <h1 style={{ color: 'red'}}>WARNING! You are severely fatigued. </h1>
              <h4>Please click on the driver icon. </h4>
            </div>
          </div>
          : null}
*/