export function setErrorState(state, error) {
  return {...state, message: null, error};
}

export function setMessageState(state, message) {
  return {...state, message, error: null};
}
