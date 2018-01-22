import React from 'react';
import moment from 'moment';

class TimeslotFree extends React.Component {
    constructor(props){
        super(props);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.state = {
            sectorLeft: 0,
            sectorRight: 'auto',
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
            //sector.css('left', 0);
        }

        if (x + w*1.25 > timeslot.clientWidth){
            this.updateSectorPosition('auto', 0);
            //sector.css('right', 0);
            //sector.css('left', 'auto');
        }

        if (x > 0 && x+w < timeslot.clientWidth && Math.abs(x - prevX) > step) {
            let tmp = (x/step).toFixed(0);
            this.updateSectorPosition(tmp*step, 'auto');
            prevX = x;
        }



    }

    slotClickHandler(){

        let date = moment(this.props.dStart);

        if (this.state.sectorRight === 'auto'){
            console.log(date.add(this.state.sectorLeft/this.props.sectorWidth, 'hours').format())
        }




        //console.log(this.props.dStart);
        //console.log(this.state.sectorLeft/this.props.sectorWidth);
    }

    render(){

        return(
            <div ref="timeslot" className="timeslot timeslot_free"
                 style={{ width: this.props.slotWidth }}
                 onMouseMove={(e) => this.mouseMoveHandler(e)}>
                <div className="sector" ref="sector" onClick={this.slotClickHandler} style={{
                    width: this.props.sectorWidth,
                    left: this.state.sectorLeft,
                    right: this.state.sectorRight
                }}>
                    <svg className="icon icon-plus">
                        <use href="img/icons_sprite.svg#plus"></use>
                    </svg>
                </div>
            </div>
        )

    }

    componentDidMount(){

      /*  this.setState({
            sectorSize: $('.timeslots').width()*6.666/100
        });*/

/*
        $(function () {
            $(window).resize(function () {
                $('.sector').css('width', ($('.timeslots').width()*6.666/100));
            });
        });*/
    }

}

export default TimeslotFree;