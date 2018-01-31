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

    handleChangeRoom(room, swap, dateStart, dateEnd){
        this.props.onSelectRoom(room, swap, dateStart, dateEnd)
    }

    render(){

        let dates = {
            start: this.props.dateStart,
            end: this.props.dateEnd
        };

        let users = Array.from(this.props.users);
        let db = {
            rooms: this.props.rooms,
            events: this.props.events
        };

        let editEventId = this.props.editEventId;

        let recommendedRooms = getRecommendations(dates, users, db, editEventId);

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

function getRecommendations(date, members, db, editEventId) {

    let nextDateSearch = moment(date.start).endOf('day');
    let isSwap = false;
    let isNextDatesSearch = false;
    let needDates = date;

    let recommendations = searchRoom(date, members, db, editEventId);

    if (recommendations.length === 0){
        isNextDatesSearch = true;
        recommendations = findFreeRoom(date, nextDateSearch, members, db, editEventId);
    }

    return recommendations;


    function searchRoom(date, members, db, editEventId) {

        let membersCount = members.length;
        // фильтр свободных комнат
        let newEventRange = moment.range(date.start, date.end);
        let events = db.events;
        let overlapsedEvents = new Map(); // id комнаты: [события пересекающиеся по датам]
        let ocupatedRooms = new Set(); // подходящие по вместимости, но занятые комнаты(id)

        events.forEach(function (event) {
            let currentEventRange = moment.range(moment(event.dateStart), moment(event.dateEnd));
            //if (newEventRange.overlaps(currentEventRange) && event.id !== editEventId){
            if ((newEventRange.overlaps(currentEventRange) ||
                 currentEventRange.overlaps(newEventRange) ||
                 newEventRange.contains(event.dateStart, { exclusive: true }) ||
                 newEventRange.contains(event.dateEnd, { exclusive: true }) ||
                 currentEventRange.contains(date.end, { exclusive: true }) ||
                 currentEventRange.contains(date.start, { exclusive: true }))  &&
                 event.id !== editEventId) {
                if (overlapsedEvents.has(+event.room.id)){
                    overlapsedEvents.get(+event.room.id).push(event)
                } else {
                    overlapsedEvents.set(+event.room.id, [event]);
                }
                if (event.room.capacity >= membersCount){
                    ocupatedRooms.add(+event.room.id);
                    if (event.dateEnd < nextDateSearch){
                        nextDateSearch = event.dateEnd;
                    }
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

        if (recomendations.length === 0 && !isSwap && !isNextDatesSearch){
            isSwap = true;
            // нет свободных переговорок
            ocupatedRooms.forEach(nextRoom => {
                //перебераем подходящие по вместимости
                let events = overlapsedEvents.get(nextRoom);

                let swpWays = events.map(event => {
                  let date =  {
                      start: Date.parse(event.dateStart),
                      end: Date.parse(event.dateEnd)
                  };
                  let members = event.users;
                  // пытаемся перенести событие из этой переговорки
                  let swaps = searchRoom(date, members, db, editEventId);
                  if (swaps.length > 0){
                    let item = swaps[0];
                    return {
                          event: event,
                          room: item.room
                      }
                  }

                  return null;
                })

                let resSwpways = swpWays.filter(swaps => swaps !== null);

                if (resSwpways.length > 0) {
                  recomendations.push({
                      eventDate: {
                          start: needDates.start,
                          end: needDates.end
                      },
                      room: events[0].room,
                      roomFloor: events[0].room.floor,
                      roomsSwap: swpWays
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

    function findFreeRoom(date, nextDateSearch, members, db, editEventId){
      console.log("findroom");
      let nextDates = {
              start: nextDateSearch,
              end: moment(nextDateSearch).add(date.end - date.start, 'ms')
          }

      let freeRoom = searchRoom(nextDates, members, db, editEventId);

      if (freeRoom.length === 0){
        freeRoom = findFreeRoom(nextDates, members, db, editEventId)
      }

      return freeRoom
    }


}


export default RoomSelect;

RoomSelect.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
    rooms: PropTypes.arrayOf(PropTypes.object),
    dateStart: PropTypes.object,
    dateEnd: PropTypes.object,
    onSelectRoom: PropTypes.func
};
