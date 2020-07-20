export const SET_FILES = 'SET_FILES';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_ERROR = 'SET_ERROR';
export const SELECT_FILE = 'SELECT_FILE';
export const UNSELECT_FILE = 'UNSELECT_FILE';
export const SELECT_GROUP = 'SELECT_GROUP';
export const UNSELECT_GROUP = 'UNSELECT_GROUP';
export const CHECK_FILE = 'CHECK_FILE';
export const UNCHECK_FILE = 'UNCHECK_FILE';
export const UNCHECK_ALL_FILE = 'UNCHECK_ALL_FILE';
export const SET_OUTPUT_RESULT = 'SET_OUTPUT_RESULT';
export const CLEAR_OUTPUT_RESULT = 'CLEAR_OUTPUT_RESULT';

export const initState = {
  message: null, 
  error: null, 
  files: [],
  selectedFile: null,
  selectedGroup: null,
  checkedFiles: [],
  outputResult: null,
};

export function appReducer(st, action) {
  switch (action.type) {
    case SET_MESSAGE: {
      return {...st, error: null, message: action.payload};
    }
    case SET_ERROR: {
      return {...st, message: null, error: action.payload};
    }
    case SET_FILES: {
      return {...st, files: action.payload};
    }
    case SELECT_FILE: {
      return {...st, selectedFile: action.payload};
    }
    case UNSELECT_FILE: {
      return {...st, selectedFile: null};
    }
    case SELECT_GROUP: {
      return {...st, selectedGroup: action.payload};
    }
    case UNSELECT_GROUP: {
      return {...st, selectedGroup: null};
    }
    case CHECK_FILE: {
      const file = action.payload;
      const checkedFiles = st.checkedFiles;
      const foundIndex = checkedFiles.findIndex((x) => x === file);
      if (foundIndex !== -1) {
        return st;
      } else {
        return {...st, checkedFiles: [...checkedFiles, file]};
      }
    }
    case UNCHECK_FILE: {
      const file = action.payload;
      const checkedFiles = st.checkedFiles;
      const foundIndex = checkedFiles.findIndex((x) => x === file);
      if (foundIndex !== -1) {
        return st;
      } else {
        const newCheckedFiles = [...checkedFiles].splice(foundIndex, 1);
        return {...st, checkedFiles: [...newCheckedFiles]};
      }
    }
    case UNCHECK_ALL_FILE: {
        return {...st, checkedFiles: []};
    }
    case SET_OUTPUT_RESULT: {
        return {...st, outputResult: action.payload};
    }
    case CLEAR_OUTPUT_RESULT: {
        return {...st, outputResult: null};
    }
    default: {
      throw new Error(`Unknown action type ${action.type}`);
    }
  }  
}