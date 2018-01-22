
let users = [
        {
            id: 1,
            login: "Ivan"
        },
        {
            id: 2,
            login: "Petr"
        }
    ];

export function loadUsersData(){
    return dispatch => {
        setTimeout(()=> dispatch({type: 'LOAD_USERS_DATA_SUCCESS', payload: users}),1000)
    }
}

export function addEvent(){
    return dispatch => {
        setTimeout(()=> dispatch({type: 'ADD_USER', payload: {}}),1000)
    }
}
