export type CardDTO = {
  forCloze: boolean,
  forBasic: boolean, 
  tags: string, 
  cloze: string, 
  basic: string, 
  source: string
};

export type QA = {
  question: string,
  answer: string
};

export type HasError = {error: string};

export type EQA = HasError | QA;

export type CardData = CardDTO & {
  clozeData: EQA, 
  basicData: EQA, 
};

export type GroupData = {
  name: string, 
  new: boolean, 
  previewCards: CardData[]
}
