const initialState = [];

export default function users(state = initialState, action){
    switch (action.type) {
        case 'LOAD_USERS_DATA_SUCCESS':
            return action.payload;
        default:
            return state;
    }
}