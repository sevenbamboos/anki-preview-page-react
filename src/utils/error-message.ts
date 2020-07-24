import React, {useEffect} from 'react';

export type MessageErrorType = {
  message: string | null,
  error: string | null
};

export function toError(error: any): string {
  if (typeof error === 'string') return error;
  else if (error.message) return error.message as string;
  else if (error.toString) return error.toString() as string;
  else return 'Unknown error';
}

export function setErrorState<T extends MessageErrorType>(state: T, error: string): T {
  return {...state, message: null, error};
}

export function setMessageState<T extends MessageErrorType>(state: T, message: string): T {
  return {...state, message, error: null};
}

type StringConsumer = (s: string) => void;

export function useMessageAndError<T extends MessageErrorType>(state: T, onMessage: StringConsumer, onError: StringConsumer) {
  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);  
}

export const MessageAndErrorContext = React.createContext({onMessage: (_msg: string)=>{}, onError: (_err: string)=>{}});
