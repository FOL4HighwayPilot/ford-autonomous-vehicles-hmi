import React, {PureComponent} from 'react';

import {Form} from '@streetscape.gl/monochrome';
import HelpPopup from './popup'; 
import FatigueScore from './fatigue-score';
import SteeringInfo from './steering-info';
import TrafficInfo from './traffic-info';
import SpeedInfo from './speed-info';

const driverImageLocation = "../assets/driver.png"

export default class ControlPanel extends PureComponent {
  state = this.props.state;

  render() {
    const {log} = this.props.state;

    return (
      <div>
        <header>
            <div id="logo">
              <a href="https://www.fordotosan.com.tr/en">
                <img src="./assets/logo.png" alt="Ford Otosan Logo"/>
              </a>
            </div>
            <button style={{backgroundColor:'transparent', borderRadius:'0', color:'white'}} 
                    onClick={this.props.togglePopup.bind(this)}> View/Hide Controls </button>
            {this.state.showPopup ? <HelpPopup closePopup={this.props.togglePopup.bind(this)}/> : null}
          </header>
          <h3>DRIVING INFO</h3>
          <hr/>
          <FatigueScore log={log} state={this.state} toggleWarning={this.props.toggleWarning} onChange={this.props.onChange}/>
          <h3>STEERING INFO</h3>
          <hr/>
          <SteeringInfo log={log} state={this.state}/>
          <h3>ROAD INFO</h3>
          <hr/>
          <TrafficInfo log={log} state={this.state}/>
          <h3>SPEED INFO</h3>
          <hr/>
          <SpeedInfo log={log}/>

          <div>
            {!this.state.showWarning ?
              <div id="hud-warning">
                <img src={driverImageLocation} className='driver-image' onClick={this.props.toggleWarning.bind(this)} />
                <div className="hud-row">
                  <h1 style={{ color: 'red'}}>WARNING! You are severely fatigued. </h1>
                  <h4>Please click on the driver icon. </h4>
                </div>
              </div>
              : null}
          </div>
    
      </div>
    );
  }
}