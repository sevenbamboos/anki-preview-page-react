export class Item {
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

export function insertNode(root, anotherItem) {

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

export function findNode(root, key) {

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


