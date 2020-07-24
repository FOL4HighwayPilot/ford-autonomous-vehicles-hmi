import React from 'react';

class HelpPopup extends React.Component {  
    render() {  
        return (  
            <div className='popup'>  
                <div className='popup-inner'>  
                    <h1>{this.props.text}</h1>
                    <div id="help">
                        <table>
                        <tbody>
                            <tr>
                            <td>
                                <h4>3D Navigation</h4>
                            </td>
                            </tr>
                            <tr>
                            <td>Pan</td>
                            <td>Mouse Left</td>
                            </tr>
                            <tr>
                            <td>Rotate</td>
                            <td>Mouse Right</td>
                            </tr>
                            <tr>
                            <td />
                            <td>Shift + Mouse Left</td>
                            </tr>

                            <tr>
                            <td>
                                <h4>Interaction</h4>
                            </td>
                            </tr>
                            <tr>
                            <td>Select 3D Object</td>
                            <td>Click</td>
                            </tr>

                            <tr>
                            <td>
                                <h4>Playback</h4>
                            </td>
                            </tr>
                            <tr>
                            <td>Play/Pause</td>
                            <td>Space</td>
                            </tr>
                            <tr>
                            <td>Prev Frame</td>
                            <td>Left Arrow</td>
                            </tr>
                            <tr>
                            <td>Next Frame</td>
                            <td>Right Arrow</td>
                            </tr>
                        </tbody>
                        </table>
                    </div> 
                </div>  
            </div>  
        )  
    }  
}  

export default HelpPopup;