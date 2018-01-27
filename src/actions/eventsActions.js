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
                            console.log(moment(value).parseZone().subtract(UTCoffset, 'minutes'));

                            return moment(value).parseZone();
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

    console.log("start", event.dateStart);
    console.log("end", event.dateEnd );

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
                          dateStart: "${event.dateStart}",
                          dateEnd: "${event.dateEnd}",                 
                      },
                      usersIds: [${event.users.map(user => user.id)}],
                      roomId: ${event.room.id}) { id }
            }`})
        }).then(response => {
            response.json()
                .then(result => {

                    event.id = result.data.createEvent.id;
                    event.dateStart = moment(event.dateStart).parseZone();
                    event.dateEnd = moment(event.dateEnd).parseZone();

                    console.log("ADD",event);

                    dispatch({type: 'ADD_EVENT', payload: event })
                });
        });
    }
}


