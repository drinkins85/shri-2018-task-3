import React from 'react'
import {NavLink} from 'react-router-dom';
import InputText from './inputText.jsx';
import RoomSelect from './roomSelect.jsx';
import moment from 'moment';
import UserSelect from './userSelect.jsx';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme || '',
            dateStart: this.props.dateStart || moment().hours(0).minutes(0),
            dateEnd: this.props.dateStart || moment().hours(0).minutes(0),
            users: new Set(),
            room: null,
            showRoomRecomendatins: false
        };
        this.changeInput = this.changeInput.bind(this);
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.setRoom = this.setRoom.bind(this);
        this.setDates = this.setDates.bind(this);
        this.checkDates = this.checkDates.bind(this);
        this.removeRoom = this.removeRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    changeInput(input, value) {

        this.setState({
                [input]: value
            }
        );

    }

    checkDates(){

        let min = moment(this.state.dateStart).hours(7).minutes(59);
        let max = moment(this.state.dateStart).hours(23).minutes(1);

        if (this.state.dateEnd > this.state.dateStart && this.state.dateStart.isAfter(min) && this.state.dateEnd.isBefore(max)){
            this.setState({
                showRoomRecomendatins: true
            })
        }
    }

    changeDate(newDate){

        let StartHours = this.state.dateStart.hours();
        let StartMinutes = this.state.dateStart.minutes();
        let EndHours = this.state.dateEnd.hours();
        let EndMinutes = this.state.dateEnd.minutes();

        this.setState({
            dateStart: moment(newDate).hours(StartHours).minutes(StartMinutes),
            dateEnd: moment(newDate).hours(EndHours).minutes(EndMinutes),
        }, this.checkDates)

    }

    setDates(type, time){
        this.setState({
            [type]: moment(this.state[type].format("YYYY-MM-DD ")+time)
        }, this.checkDates);
    }


    addUser(selectedUser) {
        this.setState({
            users:  new Set(this.state.users).add(selectedUser)
        });
    }

    removeUser(user){
        let tmpUserts = new Set(this.state.users);
        tmpUserts.delete(user);
        this.setState({
            users:  tmpUserts
        });
    }

    setRoom(room){
        this.setState({
            room: room
        })
    }

    removeRoom(){
        this.setState({
            room: null
        })
    }

    handleSubmit(e){

        e.preventDefault();

        let usersIds = Array.from(this.state.users).map(user => user.id);

        // check

        let newEvent = {
            title: this.state.theme,
            dateStart: this.state.dateStart.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]'),
            dateEnd: this.state.dateEnd.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]'),
            usersIds: usersIds,
            roomId: this.state.room
        };

        this.props.onAddEvent(newEvent);


    }

    render() {

        return (
            <div className="container">

                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-body">
                        <NavLink to="/" className="button_type_circle form__close">
                            <svg className="icon icon-close">
                                <use href="img/icons_sprite.svg#close"></use>
                            </svg>
                        </NavLink>
                        <h1 className="form__title">Новая встреча</h1>
                        <div className="form-row">
                            <div className="form-col-left">
                                <InputText inputId="theme"
                                           labelText="Тема"
                                           value={this.state.theme}
                                           clearable={true}
                                           required={true}
                                           placeholder="О чём будете говорить?"
                                           changeHandler={this.changeInput}/>
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
                                                   //this.changeInput('date', moment(this.refs.date.value).hours(0).minutes(0));
                                                   this.changeDate(moment(this.refs.date.value));
                                               }}
                                               required={true}
                                             /*  min={moment().format('YYYY-MM-DD')}
                                               max={moment().add(5, 'years').format('YYYY-MM-DD')}*/
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
                                                       //this.changeInput('timeStart', this.refs.timeStart.value);
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
                                                   onChange={() => {
                                                       //this.changeInput('timeEnd', this.refs.timeEnd.value);
                                                       this.setDates('dateEnd', this.refs.timeEnd.value);
                                                   }}
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
                                    this.state.showRoomRecomendatins &&
                                    <RoomSelect users={this.state.users}
                                                events={this.props.events}
                                                rooms={this.props.rooms}
                                                dateStart={this.state.dateStart}
                                                dateEnd={this.state.dateEnd}
                                                onSelectRoom={this.setRoom}
                                                selectedRoom={this.state.room}
                                                onCancelRoom={this.removeRoom}/>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="form-message">
                        Выберите переговорку
                    </div>

                    <div className="form-footer">
                        <NavLink to="/" className="button button_color_gray font_medium">Отмена</NavLink>
                        <button type="submit" className="button button_type_submit font_medium">Создать встречу</button>
                    </div>
                </form>

            </div>
        )
    }
}




export default Form;