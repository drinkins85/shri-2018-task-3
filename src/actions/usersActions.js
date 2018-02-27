export function loadUsersData(){
    return dispatch => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch ('/graphql', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: headers,
            body: JSON.stringify({query: `query {
                 users {  id, login, homeFloor, avatarUrl }
             }`})
        }).then(response => {
            if (response.status !== 200){
                dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: response.status, error: response.statusText}} });
                return
            }
            response.json()
                .then(result => {
                    dispatch({type: 'LOAD_USERS_DATA_SUCCESS', payload: result.data.users})
                });
        }).catch(err => {
            dispatch({type: 'ADD_MESSAGE', payload: {type:"error", data:{title: "Ошибка!", error: err}} });
        });
    }
}

export function addUser(){
    return dispatch => {
        setTimeout(()=> dispatch({type: 'ADD_USER', payload: {}}),1000)
    }
}
