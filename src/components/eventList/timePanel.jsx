import React from 'react';
import CurrentTime from './currentTime.jsx'

class TimePanel extends React.Component{

    render(){

        return (
            <div className="time-panel">

               <CurrentTime/>

                <div className="time-panel__hour">
                        <span className="time-panel__label time-panel__label_past">
                            8:00
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label time-panel__label_past">
                            9
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label time-panel__label_past">
                            10
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            11
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            12
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            13
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            14
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            15
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            16
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            17
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            18
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            19
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            20
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            21
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            22
                        </span>
                </div>
                <div className="time-panel__hour">
                        <span className="time-panel__label">
                            23
                        </span>
                </div>
            </div>
        )

    }


}

export default TimePanel;