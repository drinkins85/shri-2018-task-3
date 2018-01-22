const initialState = [];

export default function rooms(state = initialState, action){
    switch (action.type) {
        case 'LOAD_ROOMS_DATA_SUCCESS':
            return action.payload;
        default:
            return state;
    }
}