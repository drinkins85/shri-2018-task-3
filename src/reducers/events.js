const initialState = [];

export default function events(state = initialState, action){
    switch (action.type) {
        case 'LOAD_EVENTS_DATA_SUCCESS':
            return action.payload;
        default:
            return state;
    }
}