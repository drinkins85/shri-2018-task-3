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
                 events { id, title, dateStart, dateEnd, room { id, title, capacity, floor }, users {id, homeFloor, login} },
            }`})
        }).then(response => {
            response.text()
                .then(result => {

                    let parsedData = JSON.parse(result, function(key, value) {
                        if (key === 'dateStart' || key === 'dateEnd'){
                            //console.log(key, moment(value).utc());
                            return moment(value).utc();
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

    console.log(event.dateStart);

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
                      usersIds: [${event.usersIds}],
                      roomId: ${event.roomId}) { id }
            }`})
        }).then(response => {
            response.json()
                .then(result => {

                    event.id = result.data.createEvent.id;

                    console.log(event);

                    dispatch({type: 'ADD_EVENT_SUCCESS', payload: {} })
                });
        });
    }
}


