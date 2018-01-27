const initialState = [];

export default function events(state = initialState, action){
    switch (action.type) {
        case 'LOAD_EVENTS_DATA_SUCCESS':
            return action.payload;
        case 'ADD_EVENT':
            return [...state, action.payload];
        default:
            return state;
    }
}