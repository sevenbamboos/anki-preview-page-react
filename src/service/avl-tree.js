class Item {
  constructor(compareWith, key, value) {
    this.compareWith = compareWith;
    this.key = key;
    this.value = value;
  }

  isKeyLess(anotherKey) {
    return this.compareWith(this.key, anotherKey) < 0;
  }

  isLess(anotherItem) {
    return this.isKeyLess(anotherItem.key);
  }

  isKeyMore(anotherKey) {
    return this.compareWith(this.key, anotherKey) > 0;
  }

  isMore(anotherItem) {
    return this.isKeyMore(anotherItem.key);
  }

  isKeyEqual(anotherKey) {
    return this.compareWith(this.key, anotherKey) === 0;
  }

  isEqual(anotherItem) {
    return this.isKeyEqual(anotherItem.key);
  }
}

const L = 'L',
      R = 'R';

class Node {
  constructor(item, parent=null) {
    this.item = item;
    this.parent = parent;
    this.leftHeight = 0;
    this.rightHeight = 0;
  }

  height() {
    return this._height(0);
  }

  _height(count) {
    if (!this.left && !this.right) return count;
    else if (!this.left) return this.right.height(count+1);
    else if (!this.right) return this.left.height(count+1);
    else {
      return Math.max(this.left.height(count+1), this.right.height(count+1));
    }
  }

  visit(fn) {
    this._visit(fn, 0, 0);
  }

  _visit(fn, n, x) {
    fn(this.item, n, x)
    if (this.left) this.left._visit(fn, n+1, x-(10-n));
    if (this.right) this.right._visit(fn, n+1, x+(10-n));
  }

  childName(node) {
    if (node === this.left) return L;
    else if (node === this.right) return R;
    else throw Error('neither left nor right');
  }

  balanceTree() {
    const [pathType, root] = this._checkHeight();

    if (!pathType) return root;

    if (pathType === 'LL') {
      return this._moveLL(root);
    } else if (pathType === 'RR') {
      return this._moveRR(root);
    } else if (pathType === 'LR') {
      return this._moveLR(root);
    } else if (pathType === 'RL') {
      return this._moveRL(root);
    } else {
      throw Error('Unknown path type:' + pathType);
    }
  }

  setLeft(child) {
    this.left = child;
    if (child) child.parent = this;
  }

  setRight(child) {
    this.right = child;
    if (child) child.parent = this;
  }

  _moveLL(root) {
    const ln = root.left;
    const lr = ln.right;
    ln.setRight(root);
    root.setLeft(lr);

    ln.parent = null;
    ln.leftHeight = root.leftHeight-1;
    ln.rightHeight = root.rightHeight+1;

    return ln;
  }

  _moveRR(root) {
    const rn = root.right;
    const rl = rn.left;
    rn.setLeft(root);
    root.setRight(rl);
    
    rn.parent = null;
    rn.leftHeight = root.leftHeight+1;
    rn.rightHeight = root.rightHeight-1;

    return rn;
  }

  _moveLR(root) {
    const ln = root.left;
    const lr = ln.right;
    ln.setRight(lr.left);
    root.setLeft(lr.right)
    lr.setLeft(ln);
    lr.setRight(root);

    lr.parent = null;
    lr.leftHeight = root.leftHeight-1;
    lr.rightHeight = root.rightHeight+1;

    return lr;
  }

  _moveRL(root) {
    const rn = root.right;
    const rl = rn.left;
    rn.setLeft(rl.right);
    root.setRight(rl.left);
    rl.setRight(rn);
    rl.setLeft(root);

    rl.parent = null;
    rl.leftHeight = root.leftHeight+1;
    rl.rightHeight = root.rightHeight-1;

    return rl;
  }

  _checkHeight() {
    const [root, paths] = this._pathToRoot([]);
    const isLeft = paths[0] === L;
    if (isLeft) {
      root.leftHeight = Math.max(root.leftHeight, paths.length);
    } else {
      root.rightHeight = Math.max(root.rightHeight, paths.length);
    }

    const heightDiff = Math.abs(root.leftHeight - root.rightHeight);
    if (heightDiff > 1) {
      return [paths[0] + paths[1], root];
    } else {
      return [null, root];
    }
  }

  _pathToRoot(paths) {
    if (!this.parent) {
      paths.reverse();
      return [this, paths];

    } else {
      const name = this.parent.childName(this);
      paths.push(name);
      return this.parent._pathToRoot(paths);
    }
  }
}

function insertNode(root, anotherItem) {

  let node = root,
      parent = null,
      branch;

  while(node) {
    parent = node;
    if (node.item.isMore(anotherItem)) {
      node = node.left;
      branch = L;
    } else if (node.item.isLess(anotherItem)) {
      node = node.right;
      branch = R;
    } else {
      return node;
    }
  }

  node = new Node(anotherItem, parent);
  if (branch === L) {
      parent.setLeft(node);
  } else if (branch === R) {
      parent.setRight(node);
  } else {
    return new Node(anotherItem);
  }

  return node.balanceTree();
}

function findNode(root, key) {

  let node = root;
  while(node) {
    if (node.item.isKeyMore(key)) {
      node = node.left;
    } else if (node.item.isKeyLess(key)) {
      node = node.right;
    } else {
      return node;
    }
  }

  return null;
}

class SearchResult {
  constructor(item, cost, score) {
    this.item = item;
    this.cost = cost;
    this.score = score;
  }

  toString() {
    return `${this.item.key}, cost: ${this.cost}, score: ${this.score}`;
  }
}

function searchInNode(root, {key, matchFn, fuzzySearch=true}) {

  const results = [];
  let cost = 0;
  let node = root;
  while(node) {

    cost++;

    const [isAccepted, score] = matchFn(node.item.key, key)
    if (isAccepted) {
      results.push(new SearchResult(node.item, cost, score));
    }
    
    if (node.item.isKeyMore(key)) {
      node = node.left;
    } else if (node.item.isKeyLess(key)) {
      node = node.right;
    } else {
      if (fuzzySearch) {
        // continue after exact match
        node = node.right;
      } else {
        break;
      }
    }
  }

  return results;
}

const strLenDiff = (s1, s2) => Math.abs(s1.length - s2.length);

function strMatchFn(s1, s2) {
  let score = 0;

  if (s1 === s2) score = 100;
  else {
    const lenDiff = strLenDiff(s1, s2);
    if (s1.includes(s2)) {
      score = Math.max(50, 100-lenDiff*10);
    } else if (s2.includes(s1)) {
      score = Math.max(0, 50-lenDiff*10);
    }
  }

  const accepted = score >= 40;
  return [accepted, score];
}

export {
  Item,
  insertNode,
  findNode,
  searchInNode,
  strMatchFn
}

/*
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

const lh = root.leftHeight,
      rh = root.rightHeight,
      diff = Math.abs(lh-rh);

const matchFn = (k1, k2) => [k1.includes(k2), 100];
const results = searchInNode(root, {key: itemToFind, matchFn, fuzzySearch: true});
*/