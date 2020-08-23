import {Item, findNode, insertNode} from './avl-tree';
import {GroupData} from '../types';
import {cardHasError} from '../card/card-store';

function keywordItem(keyword: string, id: string) {
  return new Item((k1: string, k2: string) => k1.localeCompare(k2), keyword, [id]);
}

function updateKeywordItem(item: any, id: string) {
  const ids = item.value;
  if (ids.findIndex((x:string) => x === id) === -1) {
    item.value.push(id);
  }
}

const toId = (group: string, cardIndex: number) => `${group}:${cardIndex}`;

export async function searchKeyword(keywords: string[], index: any, fileName: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const groups = keywords.flatMap(keyword => {
        const node = findNode(index, keyword);
        if (node) {
          return node.item.value;
        } else {
          return [];
        }
      });

      const uniqueGroups = new Set();
      groups.reduce((accu, curr) => accu.add(curr), uniqueGroups);
      resolve([fileName, Array.from(uniqueGroups.values())]);

    }, 0);
  });
}

export async function addAllKeywords(groups: GroupData[]) {
  return new Promise((resolve) => {
    setTimeout(() => {

      let index = null;

      for (const group of groups) {
        for (const card of group.previewCards) {
          const basicData = card.basicData;
          if (basicData && !cardHasError(basicData)) {
            const keywords = basicData.question.split(' ');
            index = addKeywords(keywords, group.name, card.index, index);
          }
        }
      }

      resolve(index);

    }, 0);
  });
}

function addKeywords(keywords: string[], group: string, cardIndex: number, index: any) {
  let treeEntry = index;
  for (const keyword of keywords) {
    if (!keyword) continue;
    const node = findNode(treeEntry, keyword);
    const id = toId(group, cardIndex);
    if (node) {
      updateKeywordItem(node.item, id);
    } else {
      treeEntry = insertNode(treeEntry, keywordItem(keyword, id));
    }
  }
  return treeEntry;
}
