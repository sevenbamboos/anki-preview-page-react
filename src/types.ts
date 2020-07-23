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