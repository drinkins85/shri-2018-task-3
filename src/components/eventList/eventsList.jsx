import React from 'react';
import TimePanel from './timePanel.jsx'
import moment from 'moment';
import TimeslotFree from './timeslots/timeslotFree.jsx'
import TimeslotOcupated from './timeslots/timeslotOcupated.jsx'
import DatePicker from '../datepicker/datepicker.jsx';
import Modal from '../modal/modal.jsx';
import PropTypes from 'prop-types';

class EventsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment(),
            sectorWidth: 800
        };
        this.changeSectorWidth = this.changeSectorWidth.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    selectEventsByDate(date){
        let events = this.props.events;
        let eventsArr = events.filter(function (item) {
            if(moment(item.dateStart).isSame(date, 'day')){
                return item;
            }
        })
        return eventsArr.sort(function(prev, next){
            return prev.dateStart > next.dateStart
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

    handleChangeDate(newDate){
        this.setState({
            date: newDate
        })
    }

    render(){

        moment.locale('RU');
        let events = this.selectEventsByDate(this.state.date);

        let rooms = this.props.rooms;
        let start =  moment(this.state.date).hours(8).minutes(0);
        let finish =  moment(this.state.date).hours(23).minutes(0);

        let eventsMap = this.generateEventsMap(rooms, events);
        let sectorWidth = this.state.sectorWidth;

        return(

            <div className="container">

                <DatePicker value={this.state.date} onDateChange={this.handleChangeDate}/>

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
                                rooms.map((room, index) => {
                                    return(
                                        <React.Fragment key={room.id}>
                                            {
                                                (index === 0 || rooms[index-1].floor !== room.floor) &&
                                                    <div className="row-floor">
                                                        <div className="floor">
                                                            {room.floor} Этаж
                                                        </div>
                                                        <div className="floor-spacer"></div>
                                                    </div>
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
                                                            eventsMap.get(room.id).map((event, index) => {

                                                                let end = event.dateEnd;
                                                                if (event.dateEnd >= finish){
                                                                    end = finish;
                                                                }
                                                                let prevEnd;

                                                                if (index === 0 && event.dateStart >= start){
                                                                    prevEnd = start;
                                                                } else {
                                                                    prevEnd = eventsMap.get(room.id)[index-1].dateEnd;
                                                                }


                                                                if (eventsMap.get(room.id).length === index+1){
                                                                    return(
                                                                        <React.Fragment key={event.id}>
                                                                            <TimeslotFree slotWidth={calcwidth(prevEnd, event.dateStart)}
                                                                                          sectorWidth={sectorWidth}
                                                                                          dStart={prevEnd}
                                                                                          dEnd={event.dateStart}
                                                                                          formRoute={this.props.history.push}
                                                                                          roomId={room.id} />
                                                                            <TimeslotOcupated event={event} slotWidth={calcwidth(event.dateStart, end)}/>
                                                                            <TimeslotFree slotWidth={calcwidth(end, finish)}
                                                                                          sectorWidth={sectorWidth}
                                                                                          dStart={event.dateEnd}
                                                                                          dEnd={finish}
                                                                                          formRoute={this.props.history.push}
                                                                                          roomId={room.id}
                                                                            />
                                                                        </React.Fragment>
                                                                    )
                                                                }

                                                                return(
                                                                    <React.Fragment key={event.id}>
                                                                    <TimeslotFree slotWidth={calcwidth(prevEnd, event.dateStart)}
                                                                                  sectorWidth={sectorWidth}
                                                                                  dStart={prevEnd}
                                                                                  dEnd={event.dateStart}
                                                                                  formRoute={this.props.history.push}
                                                                                  roomId={room.id} />
                                                                    <TimeslotOcupated event={event} slotWidth={calcwidth(event.dateStart, end)}/>
                                                                    </React.Fragment>
                                                                 )

                                                            })
                                                        :
                                                            <TimeslotFree slotWidth="100%"
                                                                          sectorWidth={sectorWidth}
                                                                          dStart={start}
                                                                          dEnd={finish}
                                                                          formRoute={this.props.history.push}
                                                                          roomId={room.id}/>
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

                <Modal isOpen={!!this.props.messages} message={this.props.messages} onClose={this.props.clearMessages}/>

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
    return duration * 6.66 + '%';
}


export default EventsList;

EventsList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
    rooms: PropTypes.arrayOf(PropTypes.object),
    messages: PropTypes.object,
    clearMessages: PropTypes.func
};
