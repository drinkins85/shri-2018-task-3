export function loadRoomsData(){
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
                 rooms { id, title, capacity, floor }
            }`})
        }).then(response => {
            response.json()
                .then(result => {

                    let sortedRooms = result.data.rooms.sort(function (a,b) {
                        if (a.floor > b.floor){
                            return -1;
                        }
                        if (a.floor < b.floor){
                            return 1;
                        }
                    });
                    dispatch({type: 'LOAD_ROOMS_DATA_SUCCESS', payload: sortedRooms})
                });
        });
    }
}
export function addEvent(){
    return dispatch => {
        setTimeout(()=> dispatch({type: 'ADD_ROOM', payload: {}}),1000)
    }
}
