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
                            //console.log(moment(value).subtract(UTCoffset, 'minutes'));

                            return moment(value).subtract(UTCoffset, 'minutes');
                        }
                        return value;
                    });

                   /* let sortedEvents = parsedData.data.events.sort(function (a,b) {
                        if (a.room.floor > b.room.floor){
                            return -1;
                        }
                        if (a.room.floor < b.room.floor){
                            return 1;
                        }
                        if (a.room.id > b.room.id){
                            return 1
                        }
                        if (a.room.id < b.room.id){
                            return -1
                        }
                    });*/
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
    console.log(id);
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



