import React from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as eventsActions from './actions/eventsActions.js';
import * as usersActions from './actions/usersActions.js';
import * as roomsActions from './actions/roomsActions.js';
import * as messagesActions from './actions/messagesActions.js';
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
        this.props.messagesActions.getMessages();
    }

    render(){

        return (
            <Router>
                <Switch>
                    <Route exact path='/' render={(props) => {
                        return (
                            <React.Fragment>
                                <Header showAddButton={true}/>
                                <EventsList events={this.props.events}
                                            rooms={this.props.rooms}
                                            messages={this.props.messages}
                                            clearMessages={this.props.messagesActions.clearMessages}
                                            {...props}/>
                            </React.Fragment>
                        )} }/>
                    <Route path='/add-event/:start?/:end?/:room?' render={(props) => {
                        return (
                            <React.Fragment>
                                <Header showAddButton={false}/>
                                <Form users={this.props.users}
                                      events={this.props.events}
                                      rooms={this.props.rooms}
                                      onFormSubmit={this.props.eventsActions.addEvent}
                                      onChangeEventRoom={this.props.eventsActions.changeEventRoom}
                                      start={props.match.params.start}
                                      end={props.match.params.end}
                                      roomId={props.match.params.room}
                                      messages={this.props.messages}
                                      clearMessages={this.props.messagesActions.clearMessages}
                                      isEdit={false}
                                      {...props}
                                />
                            </React.Fragment>
                        )} }/>
                    <Route path='/edit-event/:id?' render={(props) => {
                        return (
                            <React.Fragment>
                                <Header showAddButton={false}/>
                                <Form eventId={props.match.params.id}
                                      users={this.props.users}
                                      events={this.props.events}
                                      rooms={this.props.rooms}
                                      onFormSubmit={this.props.eventsActions.editEvent}
                                      onChangeEventRoom={this.props.eventsActions.changeEventRoom}
                                      onDeleteEvent={this.props.eventsActions.deleteEvent}
                                      messages={this.props.messages}
                                      clearMessages={this.props.messagesActions.clearMessages}
                                      addMessage={this.props.messagesActions.addMessage}
                                      isEdit={true}
                                      {...props}
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
        rooms: state.rooms,
        messages: state.messages
    }
}

function mapDispatchToProps(dispatch) {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
        usersActions: bindActionCreators(usersActions, dispatch),
        roomsActions: bindActionCreators(roomsActions, dispatch),
        messagesActions: bindActionCreators(messagesActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
