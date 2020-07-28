import { parseBasic, parseCloze, isCardParseError } from './card/card-utils';
import {CardDTO, CardData, GroupData, EQA, OutputResult} from './types';
import {MessageErrorType} from './utils/error-message';

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
export const CLEAR_ALL_FILES = 'CLEAR_ALL_FILES';
export const AFTER_UPLOAD = 'AFTER_UPLOAD';

type AppState = MessageErrorType & {
  files: string[],
  selectedFile: string | null,
  selectedGroup: GroupData | null,
  checkedFiles: string[],
  outputResult: OutputResult | null,
};

export const initState: AppState = {
  message: null, 
  error: null, 
  files: [],
  selectedFile: null,
  selectedGroup: null,
  checkedFiles: [],
  outputResult: null,
};

function convertGroup(group: GroupData) {
  if (!group || !group.previewCards) return group;

  group.previewCards = group.previewCards.map(c => convertCard(c));
  return group;
}

function isCardData(card: any): card is CardData {
  return card.clozeData && card.basicData;
}

function convertCard(card: CardDTO | CardData): CardData {

  if (!card) return card;

  if (card.error) return {...card, clozeData: null, basicData: null};

  if (isCardData(card)) return card;

  let clozeData: EQA | null = null;
  if (card.forCloze && card.cloze) {
    const result = parseCloze(card.cloze);
    if (isCardParseError(result)) {
      clozeData = {error: result[0]};
    } else {
      const [question, answer] = result[1];
      clozeData = {question, answer};
    }
  }

  let basicData: EQA | null = null;
  if (card.forBasic && card.basic) {
    const result = parseBasic(card.basic);
    if (isCardParseError(result)) {
      basicData = {error: result[0]};
    } else {
      const [question, answer] = result[1];
      basicData = {question, answer};
    }
  }

  return {...card, clozeData, basicData};
}

function fileChecked(file: string, files: string[]) {
  if (!file || !files) return [false, -1];
  const foundIndex = files.findIndex(f => f === file);
  return [foundIndex !== -1, foundIndex]
}

type AppAction = {
  type: typeof SET_MESSAGE | typeof SET_ERROR,
  payload: string
} | {
  type: typeof SET_FILES,
  payload: string[]
} | {
  type: typeof AFTER_UPLOAD | typeof UNSELECT_FILE | typeof CLEAR_ALL_FILES | typeof UNSELECT_GROUP | typeof UNCHECK_ALL_FILE | typeof CLEAR_OUTPUT_RESULT
} | {
  type: typeof SELECT_FILE,
  payload: string
} | {
  type: typeof SELECT_GROUP,
  payload: GroupData
} | {
  type: typeof CHECK_FILE | typeof UNCHECK_FILE,
  payload: string
} | {
  type: typeof SET_OUTPUT_RESULT,
  payload: OutputResult
};

export function appReducer(st: AppState, action: AppAction) {
  switch (action.type) {
    case SET_MESSAGE: {
      return {...st, error: null, message: action.payload};
    }
    case SET_ERROR: {
      return {...st, message: null, error: action.payload};
    }
    case SET_FILES: {
      const files = action.payload;
      return {...st, files, checkedFiles: files, selectedFile: null, selectedGroup: null};
    }
    case AFTER_UPLOAD: {
      return {...st, selectedFile: null, selectedGroup: null, message: 'File Uploaded'};
    }
    case SELECT_FILE: {
      return {...st, selectedFile: action.payload};
    }
    case UNSELECT_FILE: {
      return {...st, selectedFile: null};
    }
    case CLEAR_ALL_FILES: {
      return {...st, selectedFile: null, selectedGroup: null, checkedFiles: [], /*files: [],*/ message: 'Files cleared'};
    }
    case SELECT_GROUP: {
      return {...st, selectedGroup: convertGroup(action.payload)};
    }
    case UNSELECT_GROUP: {
      return {...st, selectedGroup: null};
    }
    case CHECK_FILE: {
      const file = action.payload;
      const checkedFiles = st.checkedFiles;
      if (fileChecked(file, checkedFiles)[0]) {
        return st;
      } else {
        return {...st, checkedFiles: [...checkedFiles, file]};
      }
    }
    case UNCHECK_FILE: {
      const file = action.payload;
      const checkedFiles = st.checkedFiles;
      const [found, foundIndex] = fileChecked(file, checkedFiles);
      if (!found) {
        return st;
      } else {
        const newCheckedFiles = [];
        for (let i = 0; i < checkedFiles.length; i++) {
          if (i !== foundIndex) newCheckedFiles.push(checkedFiles[i]);
        }
        return {...st, checkedFiles: newCheckedFiles};
      }
    }
    case UNCHECK_ALL_FILE: {
        return {...st, checkedFiles: []};
    }
    case SET_OUTPUT_RESULT: {
        return {...st, outputResult: action.payload, files: [], selectedGroup: null, selectedFile: null};
    }
    case CLEAR_OUTPUT_RESULT: {
        return {...st, outputResult: null};
    }
    default: {
      throw new Error(`Unknown action ${action}`);
    }
  }  
}