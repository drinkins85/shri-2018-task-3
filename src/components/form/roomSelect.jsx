import React from 'react'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import RoomSelectItem from './roomSelectItem.jsx';

const moment = extendMoment(Moment);

class RoomSelect extends React.Component{
    constructor(props){
        super(props);

       // this.getRecommendations = this.getRecommendations.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);

    }


    handleChangeRoom(room){
        this.props.onSelectRoom(room)
       /* if (this.props.selectedRoom && this.props.selectedRoom.id === room.id){
            this.props.onCancelRoom()
        } else {
            this.props.onSelectRoom(room)
        }*/

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
            });

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


function getRecommendations(date, members, db, isSwap = false){

    let membersCount = members.length;


    // фильтр свободных комнат
    // let newEventRange = moment.range(moment(date.start.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')), moment(date.end.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')));
    let newEventRange = moment.range(date.start, date.end);
    let events = db.events;
    let overlapsedEvents = new Map(); // id комнаты: [события пересекающиеся по датам]
    let ocupatedRooms = new Set(); // подходящие по вместимости, но занятые комнаты(id)

    //console.log("new event", newEventRange);

    events.forEach(function (event) {
        let currentEventRange = moment.range(moment(event.dateStart), moment(event.dateEnd));

        //console.log(event.title, currentEventRange);

        if (newEventRange.overlaps(currentEventRange)){
            //console.log("Событие", event.title, "пересекается");
            overlapsedEvents.set(+event.room.id, event);
            if (event.room.capacity >= membersCount){
                //ocupatedRooms.push(event.room.id);
                ocupatedRooms.add(+event.room.id);
            }
        }
    });


    //console.log("overlapsed",overlapsedEvents);


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
        console.log("OOOps");

        ocupatedRooms.forEach(nextRoom => {
         //   let nextRoom = 1;
           // console.log("--",ocupatedRooms);
            let event = overlapsedEvents.get(nextRoom);
            //console.log("пытаемся переместить", event.title);
            //console.log(event);
            let date =  {
                start: Date.parse(event.dateStart),
                end: Date.parse(event.dateEnd)
            };
            let members = event.users;

            let swpWays =  getRecommendations(date, members, db, true);

            //console.log("SWPWAYS", swpWays);

            if (swpWays.length > 0){
                //swpWays.forEach(function (item) {
                let item = swpWays[0];
                recomendations.push({
                    eventDate: {
                        start: date.start,
                        end: date.end
                    },
                    room: event.room,
                    roomFloor: item.roomFloor,
                    roomsSwap:[{
                        event: event.title,
                        room: item.room
                    }]
                });
                // });
            }
        })

    }

    console.log(recomendations);

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