import React from 'react'
import {NavLink} from 'react-router-dom';
import InputText from './inputText.jsx';
import RoomSelect from './roomSelect.jsx';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import UserSelect from './userSelect.jsx';
import RoomSelectItem from './roomSelectItem.jsx';
import FormMessage from './formMessage.jsx';
import Modal from '../modal/modal.jsx';
import PropTypes from 'prop-types';

const moment = extendMoment(Moment);

class Form extends React.Component {
    constructor(props) {
        super(props);
  //      this.changeInput = this.changeInput.bind(this);
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.setRoom = this.setRoom.bind(this);
        this.setDates = this.setDates.bind(this);
        this.showRecommendations = this.showRecommendations.bind(this);
        this.checkDates = this.checkDates.bind(this);
        this.removeRoom = this.removeRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.clearFormMessages = this.clearFormMessages.bind(this);
        this.checkCapacity = this.checkCapacity.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.checkRoom = this.checkRoom.bind(this);


        let initFormState = () => {

            if (this.props.isEdit && this.props.eventId){
                let event = getEventById(this.props.events, this.props.eventId);
                if (event){
                    return {
                      theme: event.title,
                      dateStart: event.dateStart,
                      dateEnd: event.dateEnd,
                      users: new Set(getUsersByIds(this.props.users, event.users.map(user => user.id))),
                      room: event.room,
                      swap: [],
                      showRoomRecomendatins: false,
                      formMessages: []
                    }
                }
            }

            return {
                theme: '',
                dateStart: checkDate(this.props.start),
                dateEnd: checkDate(this.props.end),
                users: new Set(),
                room: getRoomById(this.props.rooms, this.props.roomId),
                swap: [],
                showRoomRecomendatins: this.props.roomId || false,
                formMessages: []
            }

        };

        this.state = initFormState();

    }

    checkDates(){
        let min = moment(this.state.dateStart).hours(7).minutes(59);
        let max = moment(this.state.dateStart).hours(23).minutes(1);
        return this.state.dateEnd > this.state.dateStart && this.state.dateStart.isAfter(min) && this.state.dateStart.isAfter(moment()) && this.state.dateEnd.isBefore(max);
    }

    showRecommendations() {
        if (this.checkDates()){
            this.setState({
                showRoomRecomendatins: true,
                room: false
            })
        }
    }

    checkRoom(){
      if (this.state.room) {
        let newEventRange = moment.range(this.state.dateStart, this.state.dateEnd)
        return this.props.events.some(event => {
          let currentEventRange = moment.range(event.dateStart, event.dateEnd);
          if (this.props.isEdit && this.props.eventId){
            if(newEventRange.overlaps(currentEventRange) && event.room.id === this.state.room.id && event.id !== this.props.eventId){
              return true;
            }
          } else {
            if(newEventRange.overlaps(currentEventRange) && event.room.id === this.state.room.id){
              return true;
            }
          }
          return false;
        })
      }
      return true;
    }

    changeDate(newDate){

        let StartHours = this.state.dateStart.hours();
        let StartMinutes = this.state.dateStart.minutes();
        let EndHours = this.state.dateEnd.hours();
        let EndMinutes = this.state.dateEnd.minutes();

        this.setState({
            dateStart: moment(newDate).hours(StartHours).minutes(StartMinutes),
            dateEnd: moment(newDate).hours(EndHours).minutes(EndMinutes),
        }, () => {
          if (this.checkRoom()){
              this.showRecommendations();
          }
        })

    }

    setDates(type, time){
        this.setState({
            [type]: moment(this.state[type].format("YYYY-MM-DD ")+time)
        }, () => {
          if (this.checkRoom()){
              this.showRecommendations();
          }
        });
    }

    addUser(selectedUser) {
        this.setState({
            users:  new Set(this.state.users).add(selectedUser)
        }, this.checkCapacity);
    }

    checkCapacity(){
        if (this.state.room && this.state.room.capacity < this.state.users.size){
            this.showRecommendations();
        }
    }

    removeUser(user){
        let tmpUserts = new Set(this.state.users);
        tmpUserts.delete(user);
        this.setState({
            users:  tmpUserts
        });
    }

    setRoom(room, swaps, dateStart, dateEnd){
        this.setState({
            room: room,
            swap: swaps,
            dateStart: dateStart,
            dateEnd: dateEnd
        })
    }

    removeRoom(){
        this.setState({
            room: false
        }, this.showRecommendations)
    }

    handleSubmit(e){
        e.preventDefault();

        let newEvent = {
            title: this.refs.theme.state.value,
            dateStart: this.state.dateStart,
            dateEnd: this.state.dateEnd,
            users: Array.from(this.state.users),
            room: this.state.room
        };

        if (this.validateForm(newEvent))
        {
            if (this.props.isEdit){
                newEvent.id = this.props.eventId;
            }
            if (this.state.swap.length >0){
              this.state.swap.forEach(swap => {
              this.props.onChangeEventRoom(swap.event, swap.room);
              })
            }

            this.props.onFormSubmit(newEvent);
            this.props.history.push("/")
        }
    }

    handleDeleteEvent(){
        this.props.addMessage({type:"confirm", data: {
            title:"Встреча будет  удалена безвозвратно",
            handleConfirm: () => {
                this.props.onDeleteEvent(this.props.eventId);
                this.props.history.push("/");
                this.props.clearMessages();
            },
        } });

    }

    clearFormMessages(){
        this.setState({
            formMessages: []
        })
    }

    render() {

        return (
            <div className="container">

                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-body">
                        <NavLink to="/" className="button_type_circle form__close">
                            <svg className="icon icon-close">
                                <use href="/img/icons_sprite.svg#close"></use>
                            </svg>
                        </NavLink>
                        <h1 className="form__title">{ this.props.isEdit ? "Редактирование встречи" : "Новая встреча"}</h1>
                        <div className="form-row">
                            <div className="form-col-left">
                                <label htmlFor="theme" className="input-label">Тема</label>
                                <InputText inputId="theme"
                                           value={this.state.theme}
                                           clearable={true}
                                           required={true}
                                           placeholder="О чём будете говорить?"
                                           ref="theme"/>
                            </div>
                            <div className="form-col-right">
                                <div className="datetime">
                                    <div className="date">
                                        <label className="input-label" htmlFor="date">Дата <span className="timelabel">и время</span></label>
                                        <input type="date"
                                               id="date"
                                               value={this.state.dateStart.format('YYYY-MM-DD')}
                                               ref="date"
                                               onChange={() => {
                                                   this.changeDate(moment(this.refs.date.value));
                                               }}
                                               required={true}
                                               min={moment().format('YYYY-MM-DD')}
                                               max={moment().add(5, 'years').format('YYYY-MM-DD')}
                                               className="form-input input-date"/>
                                    </div>
                                    <div className="time">
                                        <div className="time-start">
                                            <label className="input-label" htmlFor="timeStart">Начало</label>
                                            <input type="time"
                                                   id="timeStart"
                                                   value={this.state.dateStart.format('HH:mm')}
                                                   ref="timeStart"
                                                   onChange={() => {
                                                       this.setDates('dateStart', this.refs.timeStart.value);
                                                   }}
                                                   className="form-input input-time"
                                                   required={true}
                                                   min="08:00"
                                                   max="23:00"/>
                                        </div>
                                        <div className="time-divider"></div>
                                        <div className="time-end">
                                            <label className="input-label" htmlFor="timeEnd">Конец</label>
                                            <input type="time"
                                                   id="timeEnd"
                                                   value={this.state.dateEnd.format('HH:mm')}
                                                   ref="timeEnd"
                                                   onChange={() => this.setDates('dateEnd', this.refs.timeEnd.value)}
                                                   className="form-input input-time"
                                                   required={true}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="form-row">
                            <div className="form-col-left">
                                <label htmlFor="users" className="input-label">Участники</label>
                                <UserSelect users={this.props.users}
                                            id="users"
                                            selectedUsers={this.state.users}
                                            addUserHandler={this.addUser}
                                            removeUserHandler={this.removeUser}/>
                            </div>

                            <div className="divider"></div>

                            <div className="form-col-right">
                                {
                                    this.state.room ?
                                        <div className="radio-group">
                                            <div className="recommendation-header">
                                                <span className="radio__title_not_checked">Ваша переговорка</span>
                                            </div>
                                            <RoomSelectItem room={this.state.room}
                                                            dateStart={this.state.dateStart}
                                                            dateEnd={this.state.dateEnd}
                                                            checked={true}
                                                            handleClickRoom={this.removeRoom}
                                            />
                                        </div>
                                    :
                                    this.state.showRoomRecomendatins &&
                                        <RoomSelect users={this.state.users}
                                                    events={this.props.events}
                                                    rooms={this.props.rooms}
                                                    dateStart={this.state.dateStart}
                                                    dateEnd={this.state.dateEnd}
                                                    onSelectRoom={this.setRoom}
                                                    editEventId={this.props.eventId}
                                        />
                                }
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={!!this.props.messages} message={this.props.messages} onClose={this.props.clearMessages}/>

                    { this.state.formMessages.length > 0 &&
                            <FormMessage messages={this.state.formMessages} onClear={this.clearFormMessages}/>
                    }

                    <div className="form-footer">
                        { this.props.isEdit ?
                            <React.Fragment>
                                <NavLink to="/" className="button button_color_gray font_medium">Отмена</NavLink>
                                <button type = "button" onClick={this.handleDeleteEvent} className="button button_color_gray font_medium">Удалить встречу</button>
                                <button type="submit" className="button font_medium open-modal" >Сохранить</button>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <NavLink to="/" className="button button_color_gray font_medium">Отмена</NavLink>
                                <button type="submit" className="button button_type_submit font_medium">Создать встречу</button>
                            </React.Fragment>

                        }
                    </div>
                </form>

            </div>
        )
    }

    validateForm(data){

        if (!data.room){
            this.setState(
                {
                    formMessages: [...this.state.formMessages, "Укажите переговорку"]
                }
            );
            return  false;
        }

        if (data.theme === ''){
            this.setState(
                {
                    formMessages: [...this.state.formMessages, "Укажите тему"]
                }
            );
            return  false;
        }

        if (!this.checkDates()){
            this.setState(
                {
                    formMessages: [...this.state.formMessages, "Указано неверное время"]
                }
            );
            return  false;
        }
        return true;
    }

}

function checkDate(date) {
    if(date !== undefined && moment(date).isValid()){
        return moment(date)
    }
    return moment().hours(0).minutes(0);
}

function getRoomById(rooms, id) {
    if (id === undefined) {
        return false
    }
    let res = rooms.filter(function (room) {
        return room.id === id;
    });
    if (res.length > 0){
        return res[0];
    }
    return false;
}

function getEventById(events, id) {
    if (id === undefined) {
        return false
    }
    let res = events.filter(function (event) {
        return event.id === id;
    });
    if (res.length > 0){
        return res[0];
    }
    return false;
}

function getUsersByIds(users, ids) {
    return users.filter(function (user) {
        return ids.some(function (id) {
            return id === user.id
        })
    });
}


export default Form;

Form.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    events: PropTypes.arrayOf(PropTypes.object),
    rooms: PropTypes.arrayOf(PropTypes.object),
    onFormSubmit: PropTypes.func,
    start: PropTypes.string,
    end: PropTypes.string,
    roomId: PropTypes.string,
    messages: PropTypes.object,
    clearMessages: PropTypes.func,
    isEdit: PropTypes.bool,
    onDeleteEvent: PropTypes.func,
    addMessage: PropTypes.func
};
