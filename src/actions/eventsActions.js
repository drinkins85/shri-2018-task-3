import moment from 'moment'

export function loadEventsData(){
    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('http://localhost:3000/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `query {
                 events { id, title, dateStart, dateEnd, room { id, title, capacity, floor }, users {id, homeFloor, login, avatarUrl} },
            }`})
        }).then(response => {
            response.text()
                .then(result => {

                    let parsedData = JSON.parse(result, function(key, value) {
                        if (key === 'dateStart' || key === 'dateEnd'){
                            let UTCoffset = moment().utcOffset();
                            return moment(value).subtract(UTCoffset, 'minutes').second(0);
                        }
                        return value;
                    });
                    dispatch({type: 'LOAD_EVENTS_DATA_SUCCESS', payload: parsedData.data.events})
                });
        });
    }
}

export function addEvent(event){

    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('http://localhost:3000/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `mutation { createEvent( input: {
                          title: "${event.title}",
                          dateStart: "${event.dateStart.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')}",
                          dateEnd: "${event.dateEnd.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')}",
                      },
                      usersIds: [${event.users.map(user => user.id)}],
                      roomId: ${event.room.id}) { id }
            }`})
        }).then(response => {
            response.json()
                .then(result => {
                    event.id = result.data.createEvent.id;
                    dispatch({type: 'ADD_EVENT', payload: event });
                    dispatch({type: 'ADD_MESSAGE', payload: {type:"event-success", data: event} });

                });
        });
    }
}

export function editEvent(event) {
    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('http://localhost:3000/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `mutation { updateEvent( id: ${event.id} input: {
                          title: "${event.title}",
                          dateStart: "${event.dateStart.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')}",
                          dateEnd: "${event.dateEnd.format('YYYY-MM-DDTHH:mm:SS.SSS[Z]')}",
                      }) { id }
                      changeEventRoom (id: ${event.id}, roomId: ${event.room.id}) { id }
                      updateEventUsers( id:${event.id}, usersIds: [${event.users.map(user => user.id)}]) { id }
            }`})
        }).then(response => {
            if (response.status !== 200){
                dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: response.status, error: response.statusText}} });
                return
            }
            response.json()
                .then(result => {
                    dispatch({type: 'EDIT_EVENT', payload: event });
                    dispatch({type: 'ADD_MESSAGE', payload: {type:"event-edit-success", data: event} });

                });
        }).catch(err => {
            dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: "Ошибка!", error: err}} });
        });
    }
}

export function deleteEvent(id) {
    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('http://localhost:3000/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `mutation { removeEvent( id: ${id} ) { id } }`})
        }).then(response => {
            if (response.status !== 200){
                dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: response.status, error: response.statusText}} });
                return
            }
            response.json()
                .then(result => {
                    dispatch({type: 'DELETE_EVENT', payload: id });
                });
        }).catch(err => {
            dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: "Ошибка!", error: err}} });
        });
    }
}

export function changeEventRoom(event, room) {
    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('http://localhost:3000/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `mutation {
                      changeEventRoom (id: ${event.id}, roomId: ${room.id}) { id }
            }`})
        }).then(response => {
            if (response.status !== 200){
                dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: response.status, error: response.statusText}} });
                return
            }
            response.json()
                .then(result => {
                    dispatch({type: 'CHANGE_EVENT_ROOM', payload: {event: event, room: room} });
                    //dispatch({type: 'ADD_MESSAGE', payload: {type:"event-edit-success", data: event} });

                });
        }).catch(err => {
            dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: "Ошибка!", error: err}} });
        });
    }
}
