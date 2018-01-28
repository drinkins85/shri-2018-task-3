
export function addMessage(message){
    return {type: 'ADD_MESSAGE', payload: message}
}

export function getMessages(){
    return {type: 'GET_MESSAGES', payload: null}
}

export function clearMessages(){
    return {type: 'CLEAR_MESSAGES', payload: null}
}
