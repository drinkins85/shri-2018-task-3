import React from 'react'
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

class RoomSelect extends React.Component{
    constructor(props){
        super(props);

        this.getRecommendations = this.getRecommendations.bind(this);

    }

    getRecommendations(date, members, db){

        let membersCount = members.length;

        // фильтр свободных комнат
        let newEventRange = moment.range(date.start, date.end);
        let events = db.events;
        let overlapsedEvents = new Map(); // id комнаты: [события пересекающиеся по датам]
        let ocupatedRooms = new Set(); // подходящие по вместимости, но занятые комнаты(id)

        events.forEach(function (event) {
            let currentEventRange = moment.range(event.dateStart, event.dateEnd);

            if (newEventRange.overlaps(currentEventRange)){
                //console.log("Событие", event.title, "пересекается");
                overlapsedEvents.set(+event.room.id, event);
                if (event.room.capacity >= membersCount){
                    //ocupatedRooms.push(event.room.id);
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

        if (recomendations.length === 0){
            console.log("OOOps");
            /*
            ocupatedRooms.forEach(function (nextRoom) {
                let event = overlapsedEvents.get(nextRoom);
                //console.log(event);
                let date =  {
                    start: Date.parse(event.dateStart),
                    end: Date.parse(event.dateEnd)
                };
                let members = event.users;
                let swpWays = grecomendation(date, members, db);
                if (swpWays.length > 0){
                    //swpWays.forEach(function (item) {
                    let item = swpWays[0];
                    recomendations.push({
                        eventDate: {
                            start: date.start,
                            end: date.end
                        },
                        room: nextRoom,
                        roomFloor: item.roomFloor,
                        roomsSwap:{
                            event: event.title,
                            room: item.room
                        }
                    });
                    // });
                }
            })
            */
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


        console.log(recomendations);

        return recomendations


    }

    handleChangeRoom(roomId){
        if (this.props.selectedRoom === roomId){
            this.props.onCancelRoom()
        } else {
            this.props.onSelectRoom(roomId)
        }

    }

    render(){

        let recommendedRooms = this.getRecommendations(
            {
                start: this.props.dateStart,
                end: this.props.dateEnd
            },
            Array.from(this.props.users),
            {
                rooms: this.props.rooms,
                events: this.props.events
            });

        return(
            <div className="radio-group">
                <div className="recommendation-header">
                    <span className="radio__title_checked">Ваша переговорка</span>
                    <span className="radio__title_not_checked">Рекомендованные переговорки</span>
                </div>
                {
                    recommendedRooms.map((recommendation, index) => {
                        return(
                            <div className="radio" key={index}>
                                <input type="checkbox"
                                       className="recommend-room"
                                       id={"roomId-"+index}
                                       name="room"

                                       checked={this.props.selectedRoom === recommendation.room.id}
                                       onChange={() => this.handleChangeRoom(recommendation.room.id)} />
                                <label htmlFor={"roomId-"+index}>
                                    <span className="room-time">
                                        {recommendation.eventDate.start.format('HH:mm')}&mdash;{recommendation.eventDate.end.format('HH:mm')}
                                    </span>
                                    <span className="room-name">
                                        {recommendation.room.title}
                                    </span>
                                    <span className="room-floor">
                                        {recommendation.room.floor} этаж
                                    </span>
                                </label>
                                <label htmlFor={"roomId-"+index} className="clear-radio">
                                    <svg className="icon icon-close_color_white">
                                        <use href="img/icons_sprite.svg#close"></use>
                                    </svg>
                                </label>
                            </div>
                        )
                    })
                }


            </div>
        )
    }

}

export default RoomSelect;