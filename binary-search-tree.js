#!/usr/bin/node
/* eslint-disable max-classes-per-file */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

class Tree {
  constructor(inputArray) {
    const ordArray = [...new Set(inputArray.sort((a, b) => a - b))];
    this.root = this.buildTree(ordArray, 0, ordArray.length - 1);
  }

  buildTree(orderedArray, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new Node(orderedArray[mid]);

    root.left = this.buildTree(orderedArray, start, mid - 1);
    root.right = this.buildTree(orderedArray, mid + 1, end);

    return root;
  }

  insert(value) {
    const node = new Node(value);

    if (this.root === null) {
      this.root = node;
    }

    let aux = this.root;

    while (aux.left != null || aux.right != null) {
      if (value < aux.value) aux = aux.left;
      else aux = aux.right;
    }

    if (value < aux.value) aux.left = node;
    else aux.right = node;
  }

  delete(value, root = this.root) {
    // isEmpty
    // node isRoot
    // node isLeaf
    let children = root;
    let parent = null;

    // find children and its parent
    while (children !== null && children.value !== value) {
      parent = children;

      if (value < children.value) {
        children = children.left;
      } else {
        children = children.right;
      }
    }

    if (children === null) return root;
    if (children.left === null || children.right === null) {
      let aux;

      if (children.left === null) {
        aux = children.right;
      } else {
        aux = children.left;
      }

      // node is root
      if (parent === null) {
        return aux;
      }

      if (children === parent.left) {
        parent.left = aux;
      } else {
        parent.right = aux;
      }

      aux = null;
    } else {
      // find children's next higher value
      let p = null;
      let aux = children.right;

      while (aux.left !== null) {
        p = aux;
        aux = aux.left;
      }

      if (p !== null) {
        p.left = aux.right;
      } else {
        children.right = aux.right;
      }
      children.value = aux.value;
      aux = null;
    }
    return root;
  }

  findParent(value, upperNode, root = this.root) {
    let parent;

    if (root === null) return null;
    if (root.value === value) return upperNode;
    if (value < root.value) {
      parent = this.findParent(value, root, root.left);
    } else if (value > root.value) {
      parent = this.findParent(value, root, root.right);
    }
    return parent;
  }

  find(value, root = this.root) {
    let node;

    if (root === null) return null;
    if (root.value === value) return root;
    if (value < root.value) {
      node = this.find(value, root.left);
    } else if (value > root.value) {
      node = this.find(value, root.right);
    }
    return node;
  }

  isLeaf(node = this.root) {
    return node.left === null && node.right === null;
  }

  findLeftLeaf(node = this.root) {
    if (node === null) return null;
    if (this.isLeaf(node)) return node;
    const leftLeaf = this.findLeftLeaf(node.left);
    return leftLeaf;
  }

  levelOrder(func, root = this.root, temp = [], arr = []) {
    if (!func) {
      arr.push(root.value);
    } else {
      func(root);
    }
    if (root.left) {
      temp.push(root.left);
    }
    if (root.right) {
      temp.push(root.right);
    }

    if (!root || !temp.length) return null;

    this.levelOrder(func, temp.shift(), temp, arr);

    return !func ? arr : null;
  }

  preorder(func, root = this.root, arr = []) {
    if (!root) return null;
    if (func) {
      func(root);
    } else {
      arr.push(root.value);
    }

    this.preorder(func, root.left, arr);
    this.preorder(func, root.right, arr);

    return !func ? arr : null;
  }

  inorder(func, root = this.root, arr = []) {
    if (!root) return null;

    this.inorder(func, root.left, arr);

    if (func) func(root);
    else arr.push(root.value);

    this.inorder(func, root.right, arr);

    return !func ? arr : null;
  }

  postorder(func, root = this.root, arr = []) {
    if (!root) return null;

    this.postorder(func, root.left, arr);
    this.postorder(func, root.right, arr);

    if (func) {
      func(root);
    } else {
      arr.push(root.value);
    }

    return !func ? arr : null;
  }

  height(node = this.root) {
    if (!node) return 0;
    if (this.isLeaf(node)) return 0;

    const leftCount = this.height(node.left);
    const rightCount = this.height(node.right);

    return 1 + Math.max(leftCount, rightCount);
  }

  depth(node = this.root, root = this.root, count = 0) {
    if (root === node) return count;
    if (!root) return 0;
    if (this.isLeaf(root)) return 0;

    return (
      this.depth(node, root.left, count + 1) +
      this.depth(node, root.right, count + 1)
    );
  }

  isBalanced(root = this.root) {
    if (!root) return 0;

    const leftCount = this.isBalanced(root.left);
    const rightCount = this.isBalanced(root.right);

    if (root !== this.root) return 1 + leftCount + rightCount;
    return Math.abs(leftCount - rightCount) < 1;
  }

  rebalance() {
    if (!this.isBalanced) return;
    const ordArray = this.inorder();
    this.root = this.buildTree(ordArray, 0, ordArray.length - 1);
  }
}

function duplicateValues(node) {
  console.log(node.value * 2);
}

function randomNumbers(max) {
  const arr = [];
  const random = parseInt(5 + (max - 5) * Math.random(), 10);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < random; i++) {
    arr.push(parseInt(100 * Math.random(), 10));
  }

  return arr;
}

// create binary search tree of a random numbers

const input = randomNumbers(10);
const myTree = new Tree(input);

// tree print 
prettyPrint(myTree.root);

// confirm that tree is balanced

console.log(`Is balanced? : ${myTree.isBalanced()}`);

// print elements in level, pre, post and in order

console.log('Print in level:');
console.log(...myTree.levelOrder());

console.log('Print in preorder:');
console.log(...myTree.preorder());

console.log('Print in postorder:');
console.log(...myTree.postorder());

console.log('Print in inorder:');
console.log(...myTree.inorder());

// unbalance the tree by adding several numbers <100

myTree.insert(111);
myTree.insert(112);
myTree.insert(113);
myTree.insert(114);
myTree.insert(115);
myTree.insert(116);

// confirm that the tree is unbalanced

console.log(`Is balanced? : ${myTree.isBalanced()}`);

// balance the tree
console.log('Rebalance');
myTree.rebalance();

// confirm that the tree is balanced

console.log(`Is balanced? : ${myTree.isBalanced()}`);

// print all elements in level, pre, post and in order

console.log('Print in level:');
console.log(...myTree.levelOrder());

console.log('Print in preorder:');
console.log(...myTree.preorder());

console.log('Print in postorder:');
console.log(...myTree.postorder());

console.log('Print in inorder:');
console.log(...myTree.inorder());

// tree print 
prettyPrint(myTree.root);