const initialState = [];

export default function events(state = initialState, action){
    switch (action.type) {
        case 'LOAD_EVENTS_DATA_SUCCESS':
            return action.payload;
        case 'ADD_EVENT':
            return [...state, action.payload];
        case 'EDIT_EVENT':
            return state.map(event => {
                if (event.id === action.payload.id){
                    return action.payload
                }
                return event;
            });
        case 'DELETE_EVENT':
            return state.filter(event => event.id !== action.payload);
        default:
            return state;
    }
}