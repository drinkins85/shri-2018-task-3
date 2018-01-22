import React from 'react';

class CurrentTime extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            position: calcPosition().position,
            hours: calcPosition().hours,
            minutes: calcPosition().minutes
        }
    }

    render(){

        let time = this.state.position;
        let hours = this.state.hours;
        let minutes = this.state.minutes;

        return(

            (hours > 8 && hours < 23) ?
                <div className="current-time">
                    <div className="current-time__pointer" style={{left: time+'%'}}>
                        <div className="current-time__time">
                            {hours}:{minutes}
                        </div>
                        <div className="current-time__line"></div>
                    </div>
                </div>
            :
                <div className="current-time" style={{display: 'none'}}></div>

        )

    }

}

function calcPosition() {
    let start = new Date();
    start.setHours(8,0,0,0);
    let now = new Date();
    let delta = (now - start)/1000/60/60;
    let position = delta * 6.25;
    return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        position: position.toFixed(3)
    }
}

export default CurrentTime;