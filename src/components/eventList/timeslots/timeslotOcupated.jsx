import React from 'react';
import ReactTooltip from 'react-tooltip'

class TimeslotOcupated extends React.Component{
    constructor(props){
        super(props)
    }


    render(){

        let event = this.props.event;

        return(
            <React.Fragment>
                <div className="timeslot timeslot_ocupated drop-target"
                     style={{ width: this.props.slotWidth}}
                     data-tip='tooltip'
                     data-event='click'
                     data-for={event.id+"_tt"}>
                </div>
                <ReactTooltip globalEventOff='click' id={event.id+"_tt"} place="bottom" effect="solid" type="light" insecure={false}  >
                    <div className="drop-content">
                        <a  className="tooltip__edit button_type_circle">
                            <svg className="icon icon-edit">
                                <use href="img/icons_sprite.svg#edit"></use>
                            </svg>
                        </a>
                        <h3 className="tooltip__title">{event.title}</h3>
                        <span className="tooltip__date">{event.dateStart.format('D MMMM')}</span>
                        <span className="tooltip__time">{event.dateStart.format('H:MM')}&mdash;{event.dateEnd.format('H:MM')}</span>
                        <span className="tooltip__room">{event.room.title}</span>
                        <div className="tooltip-organizer">
                            <div className="tooltip__avatar">
                                <img src="img/weider.jpg"/>
                            </div>
                            <span className="organizer__name">Дарт Вейдер</span>
                            <span className="tooltip__users"> и 5 участников</span>
                        </div>
                    </div>
                </ReactTooltip>
            </React.Fragment>
        )
    }


}

export default TimeslotOcupated