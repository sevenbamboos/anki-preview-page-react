import {useEffect} from 'react';

export function setErrorState(state, error) {
  return {...state, message: null, error};
}

export function setMessageState(state, message) {
  return {...state, message, error: null};
}

export function useMessageAndError(state, onMessage, onError) {
  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);  
}
