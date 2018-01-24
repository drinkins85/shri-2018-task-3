import React from 'react'
import {NavLink} from 'react-router-dom';
import InputText from './inputText.jsx';

class Form extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div className="container">

                <form className="form">
                    <div className="form-body">
                        <NavLink to="/" className="button_type_circle form__close">
                            <svg className="icon icon-close">
                                <use href="img/icons_sprite.svg#close"></use>
                            </svg>
                        </NavLink>
                        <h1 className="form__title">Новая встреча</h1>

                        <div className="form-row">
                            <div className="form-col-left">
                                <InputText inputId="theme" labelText="Тема" clearable={true} required="required" placeholder="О чём будете говорить?"/>
                            </div>
                            <div className="form-col-right">
                                <div className="datetime">
                                    <div className="date">
                                        <label className="input-label" htmlFor="date">Дата <span className="timelabel">и время</span></label>
                                        <input type="date" value="" id="date" required className="form-input input-date date-format" data-date="" data-date-format="DD MMMM YYYY"/>
                                            <span className="date-formatted"></span>
                                    </div>
                                    <div className="time">
                                        <div className="time-start">
                                            <label className="input-label" htmlFor="timeStart">Начало</label>
                                            <input type="time" id="timeStart" className="form-input input-time"/>
                                        </div>
                                        <div className="time-divider"></div>
                                        <div className="time-end">
                                            <label className="input-label" htmlFor="timeEnd">Конец</label>
                                            <input type="time" id="timeEnd" className="form-input input-time"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="form-row">
                            <div className="form-col-left">
                                <div className="user-input-container">
                                    <label htmlFor="users" className="input-label">Участники</label>
                                    <input type="text" id="users" className="ui-autocomplete-input custom-combobox form-input user-input" placeholder="Например, Тор Одинович"/>
                                        <button className="dropdown-btn icon-arrow-up">
                                            <svg className="icon icon-arrow-up">
                                                <use href="img/icons_sprite.svg#arrow-up"></use>
                                            </svg>
                                        </button>
                                </div>
                                <div className="checked-users"></div>
                            </div>

                            <div className="divider"></div>

                            <div className="form-col-right">

                                <div className="radio-group">

                                    <div className="recommendation-header">
                                        <span className="radio__title_checked">Ваша переговорка</span>
                                        <span className="radio__title_not_checked">Рекомендованные переговорки</span>
                                    </div>

                                    <div className="radio">
                                        <input type="radio" className="recommend-room" id="roomId-1" name="room" required />
                                        <label htmlFor="roomId-1">
                                            <span className="room-time">
                                                16:00—16:30
                                            </span>
                                            <span className="room-name">
                                                Готем
                                            </span>
                                            <span className="room-floor">
                                                4 этаж
                                            </span>
                                        </label>
                                        <span className="clear-radio">
                                            <svg className="icon icon-close_color_white">
                                                <use href="img/icons_sprite.svg#close"></use>
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="radio">
                                        <input type="radio" className="recommend-room" id="roomId-2" name="room"  required/>
                                        <label htmlFor="roomId-2">
                                            <span className="room-time">
                                               16:00—16:30
                                            </span>
                                            <span className="room-name">
                                                Поле непаханное
                                            </span>
                                            <span className="room-floor">
                                                4 этаж
                                             </span>
                                        </label>
                                        <span className="clear-radio">
                                            <svg className="icon icon-close_color_white">
                                                <use href="img/icons_sprite.svg#close"></use>
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="radio">
                                        <input type="radio" className="recommend-room" id="roomId-3" name="room"  required/>
                                        <label htmlFor="roomId-3">
                                            <span className="room-time">
                                               16:00—16:30
                                            </span>
                                            <span className="room-name">
                                                Тёмная башня
                                            </span>
                                            <span className="room-floor">
                                                4 этаж
                                            </span>
                                        </label>
                                        <span className="clear-radio">
                                            <svg className="icon icon-close_color_white">
                                                <use href="img/icons_sprite.svg#close"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
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