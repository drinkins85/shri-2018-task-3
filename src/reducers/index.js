import { combineReducers } from 'redux';
import events from './events.js';
import users from './users.js';
import rooms from './rooms.js';

export default combineReducers({
    events: events,
    users: users,
    rooms: rooms
})