import {Item, insertNode, findNode} from './avl-tree';

function numberItem(n) {
  return new Item((x1, x2) => x1 - x2, n, n);
}

function strItem(s) {
  return new Item((s1, s2) => s1.localeCompare(s2), s, []);
}

function random(start, end) {
  return Math.floor(Math.random() * (end-start) + start);
}

function randomStr(len) {
  return Array.from(Array(len)).map(_ => String.fromCharCode(random(96, 96+25))).join('');
}

function str(v, n) {
  let rst = '';
  for (let i = 0; i < n; i++) {
    rst += v;
  }
  return rst;
}

function outputLine(nodes) {
  const aaccu = {x:0, v:''};
  return nodes.reduce((accu, curr) => {
    const len = curr.x - accu.x;
    accu.v += str(' ', len-1);
    const addedValue = `*${curr.key}`;
    accu.v += addedValue;
    accu.x = curr.x + addedValue.length;
    return accu;
  }, aaccu).v;
}

describe('AVL Tree', () => {
  test('check RL balance', () => {
    let root = null;
    root = insertNode(root, numberItem(5));
    root = insertNode(root, numberItem(10));
    root = insertNode(root, numberItem(2));
    root = insertNode(root, numberItem(12));
    root = insertNode(root, numberItem(7));
    root = insertNode(root, numberItem(9));
    expect(root.item.key).toBe(7);
  });

  test('check random', () => {

    const num = 30;
    let root = null;
    const itemKeys = new Set();
    let itemToFind;
    for (let i = 0; i < num; i++) {
      const key = random(0, num);
      if (i === 0) itemToFind = key;
      if (itemKeys.has(key)) continue;
      else itemKeys.add(key);
      const item = numberItem(key);
      root = insertNode(root, item);
    }

    let allNodes = [];
    let count = 0;
    const visitor = (item, n, x) => {
      count++;
      let nodes = allNodes[n];
      if (!nodes) {
        nodes = [];
        allNodes[n] = nodes;
      }
      nodes.push({key: item.key, x: x+50});
    };

    root.visit(visitor);
    allNodes.forEach((nodes,i) => {
      console.log(i+1, outputLine(nodes));
    });    

    expect(count === itemKeys.size).toBeTruthy();

    const lh = root.leftHeight,
          rh = root.rightHeight,
          diff = Math.abs(lh-rh);
    expect(diff<2).toBeTruthy();

    const found = findNode(root, itemToFind);
    expect(found.item.key).toBe(itemToFind);
  });

  test('check str', () => {

    const num = 100;
    let root = null;
    const itemKeys = new Set();
    let itemToFind;
    for (let i = 0; i < num; i++) {
      const key = randomStr(random(2, 10));
      if (i === 0) itemToFind = key;
      if (itemKeys.has(key)) continue;
      else itemKeys.add(key);
      const item = strItem(key);
      root = insertNode(root, item);
    }

    let allNodes = [];
    let count = 0;
    const visitor = (item, n, x) => {
      count++;
      let nodes = allNodes[n];
      if (!nodes) {
        nodes = [];
        allNodes[n] = nodes;
      }
      nodes.push({key: item.key, x: x+50});
    };

    root.visit(visitor);
    allNodes.forEach((nodes,i) => {
      console.log(i+1, outputLine(nodes));
    });    

    expect(count === itemKeys.size).toBeTruthy();

    const lh = root.leftHeight,
          rh = root.rightHeight,
          diff = Math.abs(lh-rh);
    expect(diff<2).toBeTruthy();

    const found = findNode(root, itemToFind);
    expect(found.item.key).toBe(itemToFind);
  });
});