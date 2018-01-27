import React from 'react';
import moment from 'moment';


class TimeslotFree extends React.Component {
    constructor(props){
        super(props);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.state = {
            sectorLeft: 0,
            sectorRight: 'auto'
        };
        this.updateSectorPosition = this.updateSectorPosition.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.slotClickHandler = this.slotClickHandler.bind(this);
    }

    updateSectorPosition(left, right){
        this.setState({
            sectorLeft: left,
            sectorRight: right
        });
    }



    mouseMoveHandler(e){
        let sectorSize = this.props.sectorWidth;
        let timeslot = this.refs.timeslot;
        let prevX = 0;
        let step = this.props.sectorWidth/4;
        let x = e.pageX - timeslot.offsetLeft - sectorSize/2;


        let sector = this.refs.sector;
        let w = sectorSize;

        if (x < 0){
            this.updateSectorPosition(0, 'auto');
        }

        if (x + w*1.25 > timeslot.clientWidth){
            this.updateSectorPosition('auto', 0);
        }

        if (x > 0 && x+w < timeslot.clientWidth && Math.abs(x - prevX) > step) {
            let tmp = (x/step).toFixed(0);
            this.updateSectorPosition(tmp*step, 'auto');
            prevX = x;
        }
    }


    slotClickHandler(){
        let dateStart = moment(this.props.dStart);
        let dateEnd = moment(this.props.dEnd);
        let start;
        let end;
        if (this.state.sectorRight === 'auto'){
            start = dateStart.add(this.state.sectorLeft/this.props.sectorWidth, 'hours').format('YYYY-MM-DDTHH:mm');
            end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm');
        } else {
            start = dateEnd.subtract(1, 'hours').format('YYYY-MM-DDTHH:mm');
            end = dateEnd.format('YYYY-MM-DDTHH:mm');
        }
        this.props.formRoute(`/add-event/${start}/${end}/${this.props.roomId}`)
    }

    render(){

        return(
            <div ref="timeslot" className="timeslot timeslot_free"
                 style={{ width: this.props.slotWidth }}
                 onMouseMove={(e) => this.mouseMoveHandler(e)}>
                <div className="sector" ref="sector" onClick={this.slotClickHandler} style={{
                    width: this.props.sectorWidth,
                    maxWidth: '100%',
                    left: this.state.sectorLeft,
                    right: this.state.sectorRight
                }}>
                    <svg className="icon icon-plus">
                        <use href="/img/icons_sprite.svg#plus"></use>
                    </svg>
                </div>
            </div>
        )

    }

}

export default TimeslotFree;