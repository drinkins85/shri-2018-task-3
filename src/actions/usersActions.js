export function loadUsersData(){
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
                 users {  id, login, homeFloor, avatarUrl }
             }`})
        }).then(response => {
            response.json()
                .then(result => {
                    dispatch({type: 'LOAD_USERS_DATA_SUCCESS', payload: result.data.users})
                });
        });
    }
}

export function addUser(){
    return dispatch => {
        setTimeout(()=> dispatch({type: 'ADD_USER', payload: {}}),1000)
    }
}
