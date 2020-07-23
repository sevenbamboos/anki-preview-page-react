import React, {useEffect} from 'react';

export type MessageErrorType = {
  message: string | null,
  error: string | null
};

// TODO how to avoid using any for a function used by multiple components with different types of state?

export function setErrorState(state: any, error: string) {
  return {...state, message: null, error};
}

export function setMessageState(state: any, message: string) {
  return {...state, message, error: null};
}

type StringConsumer = (s: string) => void;

export function useMessageAndError(state: any, onMessage: StringConsumer, onError: StringConsumer) {
  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);  
}

export const MessageAndErrorContext = React.createContext({onMessage: (_msg: string)=>{}, onError: (_err: string)=>{}});
