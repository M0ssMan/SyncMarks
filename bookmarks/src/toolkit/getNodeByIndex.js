export function getNodeByIndex(indexString, tree) {
  const pathIndices = indexString.split('.');
  let treeNode = tree;
  pathIndices.forEach((indexPath, index) => {
    if (index === 0) {
      treeNode = treeNode[Number(indexPath)];
      return;
    }
    treeNode = treeNode.children[Number(indexPath)];
  });
  return treeNode;
}
