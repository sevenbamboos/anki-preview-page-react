export type CardDTO = {
  forCloze: boolean,
  forBasic: boolean, 
  tags: string, 
  cloze: string, 
  basic: string, 
  source: string,
  error?: string
};

export type QA = {
  question: string,
  answer: string
};

export type HasError = {error: string};

export type EQA = HasError | QA;

export type CardData = CardDTO & {
  clozeData: EQA | null, 
  basicData: EQA | null, 
};

export type GroupData = {
  name: string, 
  new: boolean, 
  previewCards: CardData[]
};

export type OutputResult = {
  basicCards: string[],
  clozeCards: string[],
  groups: string[],
};

export type NormalizedObjects<T> = {
  ids: string[],
  entities: {
    [id: string]: T
  }
}

export const statusIdle = 'idle';
export const statusLoading = 'loading';
export const statusSucceeded = 'succeeded';
export const statusFailed = 'failed';
export type FetchStatus = 
  typeof statusIdle | 
  typeof statusLoading | 
  typeof statusSucceeded | 
  typeof statusFailed;

// export type Failure = {
//   error: string
// }

// export type Success<T> = {
//   value: T
// }

// export type Tryable<T> = Success<T> | Failure

// export type FetchState<T> = {
//   loading: boolean,
//   result: Tryable<T> 
// };
