import React from 'react';
import TimePanel from './timePanel.jsx'
import moment from 'moment';
import TimeslotFree from './timeslots/timeslotFree.jsx'
import TimeslotOcupated from './timeslots/timeslotOcupated.jsx'
//import {NavLink} from 'react-router-dom';

class EventsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment("2017-12-13T00:00:00.981Z").utc(),
            sectorWidth: 800
        };

        this.changeSectorWidth = this.changeSectorWidth.bind(this);

    }

    selectEventsByDate(date){
        let events = this.props.events;
        //console.log(events);
        return events.filter(function (item) {
            if(moment(item.dateStart).isSame(date, 'day')){
                return item;
            }
        })
    }

    generateEventsMap(rooms, events){
        let eventsMap = new Map;

        rooms.forEach(function (room) {
            eventsMap.set(room.id,[]);
        });

        events.forEach(function (event) {
           eventsMap.get(event.room.id).push(event);
        });

        return eventsMap;

    }


    render(){
        moment.locale('RU');
        let events = this.selectEventsByDate(this.state.date);
        let rooms = this.props.rooms;
        let start =  moment("2017-12-13T08:00:00.981Z").utc();
        let finish =  moment("2017-12-13T23:00:00.981Z").utc();

        let eventsMap = this.generateEventsMap(rooms, events);

        let sectorWidth = this.state.sectorWidth;

        return(

            <div className="container">
                <div className="datepicker">
                    calendar
                </div>
                <div className="scroll-container">
                    <div className="scrolling-area">

                        <div className="over-grid">
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                            <div className="over-grid__hour">
                                <div className="over-grid__line"></div>
                            </div>
                        </div>

                        <TimePanel/>

                        <div className="left-column-bg"></div>

                        <div className="rows-container" ref="rowsContainer" >
                            {
                                rooms.map(function (room, index){
                                    return(
                                        <React.Fragment key={room.id}>
                                            {
                                                (index === 0 || rooms[index-1].floor !== room.floor)?
                                                    <div className="row-floor">
                                                        <div className="floor">
                                                            {room.floor} Этаж
                                                        </div>
                                                        <div className="floor-spacer"></div>
                                                    </div>
                                                :
                                                    <React.Fragment></React.Fragment>
                                            }

                                            <div className="row-room">
                                            <div className="room room_disabled">
                                                <span className="room__name font_medium">{room.title}</span>
                                                <span className="room__capacity">до {room.capacity} человек</span><br/>
                                            </div>

                                            <div className="timeline">
                                                <div className="timeslots">
                                                    {
                                                        eventsMap.get(room.id).length > 0 ?

                                                            eventsMap.get(room.id).map(function (event, index) {

                                                                let end = event.dateEnd;
                                                                if (event.dateEnd > finish){
                                                                    end = finish;
                                                                }

                                                                let prevEnd;

                                                                if (index === 0 && event.dateStart > start){
                                                                    prevEnd = start;
                                                                } else {
                                                                    prevEnd = eventsMap.get(room.id)[index-1].dateEnd;
                                                                }


                                                                if (eventsMap.get(room.id).length === index+1){
                                                                    return(
                                                                        <React.Fragment key={event.id}>
                                                                            <TimeslotFree slotWidth={calcwidth(prevEnd, event.dateStart)} sectorWidth={sectorWidth}/>
                                                                            <TimeslotOcupated event={event} slotWidth={calcwidth(event.dateStart, end)}/>
                                                                            <TimeslotFree slotWidth={calcwidth(end, finish)} sectorWidth={sectorWidth}/>
                                                                        </React.Fragment>
                                                                    )
                                                                }


                                                                return(
                                                                    <React.Fragment key={event.id}>
                                                                        <TimeslotFree slotWidth={calcwidth(prevEnd, event.dateStart)} sectorWidth={sectorWidth}/>
                                                                        <TimeslotOcupated event={event} slotWidth={calcwidth(event.dateStart, end)}/>
                                                                    </React.Fragment>
                                                                 )

                                                            })
                                                        :
                                                            <TimeslotFree slotWidth="100%" sectorWidth={sectorWidth} dStart={start} dEnd={finish} />
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    changeSectorWidth(){
        this.setState({
            sectorWidth: document.querySelector('.over-grid__hour').clientWidth
        });
    }

    componentDidMount() {
        this.changeSectorWidth();
        window.addEventListener("resize", this.changeSectorWidth);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.changeSectorWidth);
    }


}

function calcwidth(start, end){
    let duration = (end - start)/1000/60/60;
    //console.log(duration);
    return duration * 6.66 + '%';
}


export default EventsList;