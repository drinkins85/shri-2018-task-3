const initialState = null;

export default function messages(state = initialState, action){
    switch (action.type) {
        case 'ADD_MESSAGE':
            return action.payload;
        case 'CLEAR_MESSAGES': {
            return action.payload;
        }
        case 'GET_MESSAGES':
            return state;
        default:
            return state;
    }
}