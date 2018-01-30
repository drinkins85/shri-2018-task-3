import React from 'react'
import moment from 'moment';

class RoomSelectItem extends React.Component{

    render(){

        let room = this.props.room;
        let checked = this.props.checked;
        let dateStart = moment(this.props.dateStart).format('HH:mm');
        let dateEnd = moment(this.props.dateEnd).format('HH:mm');
        let roomsSwap = this.props.roomsSwap;

        return(
            <div className="radio">
                <input type="checkbox"
                       className="recommend-room"
                       id={"roomId-"+room.id}
                       name="room"
                       checked={checked}
                       onChange={() => this.props.handleClickRoom(room, roomsSwap)} />
                <label htmlFor={"roomId-"+room.id}>
                    <span className="room-time">{dateStart}&mdash;{dateEnd}</span>
                    <span className="room-name">{room.title}</span>
                    <span className="room-floor">{room.floor} этаж </span>
                </label>
                <label htmlFor={"roomId-"+room.id} className="clear-radio">
                    <svg className="icon icon-close_color_white">
                        <use href="/img/icons_sprite.svg#close"></use>
                    </svg>
                </label>
                {
                    !!roomsSwap && roomsSwap.length > 0 &&
                    roomsSwap.map((swap,index) => <div className="room-swap" key={index}>Перенос: <span className="event-swap">{swap.event.title}</span> &rarr; {swap.room.title}  <span className="room-floor">{swap.room.floor} этаж </span></div>)
                }
            </div>
        )
    }

}

export default RoomSelectItem;
