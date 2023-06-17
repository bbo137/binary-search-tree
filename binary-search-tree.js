#!/usr/bin/node
/* eslint-disable max-classes-per-file */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Tree {
  constructor(inputArray) {
    this.root = this.buildTree(inputArray, 0, inputArray.length - 1);
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

    while (aux.left != null && aux.right != null) {
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
      parent = this.findParent(value, root, root.right)
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
    return (node.right === null && node.left === null);
  }

  findLeftLeaf (node = this.root) {
    if (node === null) return null;
    if (this.isLeaf(node)) return node;
    const leftLeaf = this.findLeftLeaf(node.left);
    return leftLeaf;
  }

  /*   find() {}

  levelOrder() {}

  inorder() {}

  preorder() {}

  posorder() {}

  height() {}

  depth() {}

  isBalanced() {}

  rebalance() {} */
}

const input = [3, 1, 6, 7, 5, 4, 9, 10, 11, 13 ,15, 17, 19, 21, 23];
//const input = [ 1, 3];
const ordInt = [...new Set(input.sort(function(a,b){
  return a - b ;
}))];
console.log(ordInt);
treee = new Tree(ordInt);
console.log(treee.root.value)

prettyPrint(treee.root);
treee.delete(17)
prettyPrint(treee.root);
console.log(treee.find(10))


