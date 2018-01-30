import React from 'react'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import RoomSelectItem from './roomSelectItem.jsx';
import PropTypes from 'prop-types';

const moment = extendMoment(Moment);

class RoomSelect extends React.Component{
    constructor(props){
        super(props);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);

    }

    handleChangeRoom(room, swap){
        this.props.onSelectRoom(room, swap)
    }

    render(){

        let recommendedRooms = getRecommendations(
            {
                start: this.props.dateStart,
                end: this.props.dateEnd
            },
            Array.from(this.props.users),
            {
                rooms: this.props.rooms,
                events: this.props.events
            },
            this.props.editEventId
          );

        return(
            <div className="radio-group">
                <div className="recommendation-header">
                    <span className="radio__title_not_checked">Рекомендованные переговорки</span>
                </div>
                {
                    recommendedRooms.map((recommendation, index) => {
                        return(
                            <RoomSelectItem room={recommendation.room}
                                            dateStart={recommendation.eventDate.start}
                                            dateEnd={recommendation.eventDate.end}
                                            checked={false}
                                            roomsSwap={recommendation.roomsSwap}
                                            handleClickRoom={this.handleChangeRoom}
                                            key={index}
                            />
                        )
                    })
                }


            </div>
        )
    }

}


function getRecommendations(date, members, db, editEventId, isSwap = false){

    let membersCount = members.length;

    // фильтр свободных комнат
    let newEventRange = moment.range(date.start, date.end);
    let events = db.events;
    let overlapsedEvents = new Map(); // id комнаты: [события пересекающиеся по датам]
    let ocupatedRooms = new Set(); // подходящие по вместимости, но занятые комнаты(id)

    events.forEach(function (event) {
        let currentEventRange = moment.range(moment(event.dateStart), moment(event.dateEnd));
        if (newEventRange.overlaps(currentEventRange) && event.id !== editEventId){
            overlapsedEvents.set(+event.room.id, event);
            if (event.room.capacity >= membersCount){
                ocupatedRooms.add(+event.room.id);
            }
        }
    });

    let resCapacity = db.rooms.filter(function(item){
        return (item.capacity >= membersCount && !ocupatedRooms.has(+item.id));
    });

    let recomendations = [];
    db.rooms.forEach(function (item) {
        if (item.capacity >= membersCount && !ocupatedRooms.has(+item.id)){
            recomendations.push({
                eventDate: {
                    start: date.start,
                    end: date.end
                },
                room: item,
                roomsSwap:[]
            });
        }
    });

    if (recomendations.length === 0 && !isSwap){
    // нет свободных переговорок

        ocupatedRooms.forEach(nextRoom => {
            //перебераем подходящие по вместимости
            let event = overlapsedEvents.get(nextRoom);
            let date =  {
                start: Date.parse(event.dateStart),
                end: Date.parse(event.dateEnd)
            };
            let members = event.users;
            // пытаемся перенести событие из этой переговорки
            let swpWays =  getRecommendations(date, members, db, editEventId, true);
            if (swpWays.length > 0){
                let item = swpWays[0];
                recomendations.push({
                    eventDate: {
                        start: date.start,
                        end: date.end
                    },
                    room: event.room,
                    roomFloor: item.roomFloor,
                    roomsSwap:[{
                        event: event,
                        room: item.room
                    }]
                });
            }
        })
    }

    // сортировка по количеству пройденных этажей
    recomendations.sort(function(a,b) {
        let flCountA = members.reduce((sum, current) => sum += Math.abs(current.homeFloor - a.room.floor), 0);
        let flCountB = members.reduce((sum, current) => sum += Math.abs(current.homeFloor - b.room.floor), 0);
        if (flCountA > flCountB){
            return 1;
        }
        if (flCountA < flCountB){
            return -1;
        }
    });
    return recomendations
}


export default RoomSelect;

RoomSelect.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
    rooms: PropTypes.arrayOf(PropTypes.object),
    dateStart: PropTypes.object,
    dateEnd: PropTypes.object,
    onSelectRoom: PropTypes.func
};
