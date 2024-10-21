import { isDefined } from "./assert";

interface TraversalMethods<NodeType extends TreeNode = TreeNode> {
  traversePreOrder: (callback: (node: NodeType) => void) => void;
  traversePostOrder: (callback: (node: NodeType) => void) => void;
  traverseDepthFirst: (callback: (node: NodeType) => void) => void;
  traverseBreadthFirst: (callback: (node: NodeType) => void) => void;
}

interface TreeNodeState<ValueType, NodeType extends TreeNode = TreeNode> {
  value: ValueType;
  children: NodeType[];
  parent: NodeType | null;
  root: NodeType;
}

interface TreeNodeActions<ValueType, NodeType extends TreeNode = TreeNode> {
  isRoot: () => boolean;

  addChild: <ChildValueType, ChildNodeType extends TreeNode<ChildValueType>>(
    value: ChildValueType,
  ) => ChildNodeType;

  addNode: <ChildValueType, ChildNodeType extends TreeNode<ChildValueType>>(
    node: ChildNodeType,
  ) => ChildNodeType;

  addNodes: <ChildValueType, ChildNodeType extends TreeNode<ChildValueType>>(
    nodes: ChildNodeType[],
  ) => ChildNodeType[];

  all: () => Generator<NodeType>;

  hasChildren: () => boolean;
  hasSiblings: () => boolean;

  getValue: <V extends ValueType>() => V;
}

export interface TreeNode<T = unknown>
  extends TreeNodeState<T>,
    TreeNodeActions<T>,
    TraversalMethods {}

export type NodeFactory<T = TreeNode> = (
  value: unknown,
  parent?: TreeNode | null,
) => T;

export interface TreeNodeOptions<T> {
  value: T;
  parent?: TreeNode | null;
  nodeFactory?: NodeFactory;
}

export function treeNode<T = unknown>({
  value,
  parent = null,
  nodeFactory = (childValue, childParent) =>
    treeNode({ value: childValue, parent: childParent, nodeFactory }),
}: TreeNodeOptions<T>): TreeNode<T> {
  const children: TreeNode[] = [];

  const node: TreeNode<T> = {
    value,
    parent,
    children,

    get root() {
      return isDefined(parent) ? parent.root : this;
    },

    getValue<V extends T>() {
      return value as V;
    },

    addChild<ValueType, ChildNodeType extends TreeNode<ValueType>>(
      childValue: ValueType,
    ): ChildNodeType {
      const newNode = nodeFactory(childValue, node);
      children.push(newNode);
      return newNode as ChildNodeType;
    },

    addNode(childNode) {
      children.push(childNode);
      return childNode;
    },

    addNodes(nodes) {
      children.push(...nodes);
      return nodes;
    },

    *all() {
      for (const childNode of children) {
        yield childNode;
        yield* childNode.all();
      }
    },

    hasChildren() {
      return children.length > 0;
    },

    hasSiblings() {
      return parent !== null && parent.children.length > 1;
    },

    isRoot() {
      return !parent;
    },

    traversePostOrder(callback): void {
      children.forEach((child) => {
        child.traversePostOrder(callback);
      });
      callback(node);
    },

    traversePreOrder(callback): void {
      callback(node);
      children.forEach((child) => {
        child.traversePreOrder(callback);
      });
    },

    traverseDepthFirst(callback) {
      const collection: TreeNode[] = [node];

      while (collection.length > 0) {
        const current = collection.pop();
        if (!current) {
          break;
        }

        callback(current);

        for (let i = current.children.length - 1; i >= 0; i--) {
          collection.push(current.children[i]);
        }
      }
    },

    traverseBreadthFirst(callback) {
      const collection: TreeNode[] = [node];

      while (collection.length > 0) {
        const current = collection.shift();
        if (!current) {
          break;
        }

        callback(current);

        for (const child of current.children) {
          collection.push(child);
        }
      }
    },
  };

  return node;
}
