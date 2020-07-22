
export function parseBasic(card: string) 
  : [string, []] | [null, string[]] {
  if (!card) return ['No Contents', []];

  const rst = card.split('|');
  if (!rst || rst.length !== 2) {
    return [`Can't parse ${card}`, []];
  } else {
    return [null, rst];
  }
}

export function parseTags(tags: string) {
  if (!tags) return [];
  return tags.split(' ');
}

class Token {
  value: string;
  isFilling: boolean;
  fillingName?: string;

  constructor(value: string, isFilling: boolean) {
    this.isFilling = isFilling;
    if (isFilling) {
      const [fillingName, fillingValue] = value.split('::');
      this.fillingName = fillingName;
      this.value = fillingValue;
    } else {
      this.value = value;
    }    
  }

  fmtQuestion() {
    if (this.isFilling) {
      return this.value.split('').map(c => '_').join('');
    } else {
      return this.value;
    }
  };  
}

export function parseCloze(card: string)
  : [string, []] | [null, [string, string]] {
  if (!card) return ['No Contents', []];

  const tokens = [];
  const rangeSymbol = (insideFilling:boolean) => insideFilling ? '}}' : '{{';

  let index = 0;
  let insideFilling = false;
  let rangeEnd = -1;

  while(index < card.length) { 
    rangeEnd = card.indexOf(rangeSymbol(insideFilling), index);
    rangeEnd = rangeEnd === -1 ? card.length : rangeEnd;
    tokens.push(new Token(card.substring(index, rangeEnd), insideFilling));
    index = rangeEnd+2;
    insideFilling = !insideFilling;
  }

  const question = tokens.map(t => t.fmtQuestion()).join('');
  const answer = tokens.map(t => t.value).join('');
  return [null, [question, answer]];
}
