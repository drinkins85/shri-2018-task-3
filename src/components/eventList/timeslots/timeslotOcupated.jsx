import React from 'react';
import ReactTooltip from 'react-tooltip'
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as utils from './../../../scripts/utils.js';

class TimeslotOcupated extends React.Component{
    constructor(props){
        super(props)
    }


    render(){

        let event = this.props.event;
        let usersCount = event.users.length;

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
                        <NavLink to={`/edit-event/${event.id}`}  className="tooltip__edit button_type_circle">
                            <svg className="icon icon-edit">
                                <use href="img/icons_sprite.svg#edit"></use>
                            </svg>
                        </NavLink>
                        <h3 className="tooltip__title">{event.title}</h3>
                        <span className="tooltip__date">{event.dateStart.format('D MMMM')}</span>
                        <span className="tooltip__time">{event.dateStart.format('HH:mm')}&mdash;{event.dateEnd.format('HH:mm')}</span>
                        <span className="tooltip__room">{event.room.title}</span>
                        <div className="tooltip-organizer">

                            {
                                usersCount > 0 &&   <div className="tooltip__avatar"><img src={event.users[0].avatarUrl}/></div>
                            }

                            {
                                usersCount > 0 &&  <span className="organizer__name">{ event.users[0].login }</span>
                            }

                            {
                                usersCount-1 > 0  && <span className="tooltip__users"> и { usersCount-1 } { utils.pluralForms(usersCount-1, ['участник', 'участника', 'участников']) }</span>
                            }

                        </div>
                    </div>
                </ReactTooltip>
            </React.Fragment>
        )
    }


}

export default TimeslotOcupated

TimeslotOcupated.propTypes = {
    event: PropTypes.object,
    slotWidth: PropTypes.string
};
