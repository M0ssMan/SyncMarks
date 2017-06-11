import { getNodeByIndex } from './getNodeByIndex';

function filterOutChildren(treeNode) {
  const reducedTreeNode = treeNode.children.reduce((acc, node) => {
    if (node.folder) {
      acc.push({
        ...node,
        children: []
      });
      return acc;
    }
    acc.push({ ...node });
    return acc;
  }, []);
  return reducedTreeNode;
}

export function removeChildren(indexString, tree) {
  const selectedNode = getNodeByIndex(indexString, tree);
  return filterOutChildren(selectedNode);
}
