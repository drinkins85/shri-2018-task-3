import React from 'react'

class RoomSelectItem extends React.Component{

    render(){

        let room = this.props.room;
        let checked = this.props.checked;
        let dateStart = this.props.dateStart.format('HH:mm');
        let dateEnd = this.props.dateEnd.format('HH:mm');

        return(
            <div className="radio">
                <input type="checkbox"
                       className="recommend-room"
                       id={"roomId-"+room.id}
                       name="room"
                       checked={checked}
                       onChange={() => this.props.handleClickRoom(room)} />
                <label htmlFor={"roomId-"+room.id}>
                    <span className="room-time">{dateStart}&mdash;{dateEnd}</span>
                    <span className="room-name">{room.title}</span>
                    <span className="room-floor">{room.floor} этаж</span>
                </label>
                <label htmlFor={"roomId-"+room.id} className="clear-radio">
                    <svg className="icon icon-close_color_white">
                        <use href="/img/icons_sprite.svg#close"></use>
                    </svg>
                </label>
            </div>
        )
    }

}

export default RoomSelectItem;


