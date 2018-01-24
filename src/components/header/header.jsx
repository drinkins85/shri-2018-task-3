import React from 'react';
import {NavLink} from 'react-router-dom';

class EventsList extends React.Component {

    render(){

        return (
            <header>
                <div className="header">
                    <img src="img/logo.svg" className="logo"/>
                    {
                        this.props.showAddButton &&
                            <NavLink to="/form" className="button header__button font_medium">Создать встречу</NavLink>
                    }

                </div>
            </header>
        )
    }

}

export default EventsList;