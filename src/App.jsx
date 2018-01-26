import React from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as eventsActions from './actions/eventsActions.js';
import * as usersActions from './actions/usersActions.js';
import * as roomsActions from './actions/roomsActions.js';
import {BrowserRouter as Router, Route, Link, NavLink, Switch, Redirect} from 'react-router-dom';
import EventsList from './components/eventList/eventsList.jsx';
import Header from './components/header/header.jsx';
import Form from './components/form/form.jsx'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.props.eventsActions.loadEventsData();
        this.props.usersActions.loadUsersData();
        this.props.roomsActions.loadRoomsData();
    }

    render(){

        return (
            <Router>
                <Switch>
                    <Route exact path='/' render={() => {
                        return (
                            <React.Fragment>
                                <Header showAddButton={true}/>
                                <EventsList events={this.props.events} rooms={this.props.rooms}/>
                            </React.Fragment>
                        )} }/>
                    <Route exact path='/form' render={() => {
                        return (
                            <React.Fragment>
                                <Header showAddButton={false}/>
                                <Form isEdit={false}
                                      users={this.props.users}
                                      events={this.props.events}
                                      rooms={this.props.rooms}
                                      onAddEvent={this.props.eventsActions.addEvent}
                                />
                            </React.Fragment>
                        )} }/>
                    <Route path='*' render={() => {
                        return <div className="page-not-found"><h1>Page not found</h1></div>
                    }
                    }/>
                </Switch>
            </Router>
        )
    }

}

function mapStateToProps (state) {
    return {
        events: state.events,
        users: state.users,
        rooms: state.rooms
    }
}

function mapDispatchToProps(dispatch) {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
        usersActions: bindActionCreators(usersActions, dispatch),
        roomsActions: bindActionCreators(roomsActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
