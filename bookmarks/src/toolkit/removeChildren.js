// import { get } from 'lodash';
// import { notNil } from 'utils';
import { getNodeByIndex } from './getNodeByIndex';

function filterOutChildren(treeNode) {
  console.log('treeNode', treeNode);
  const reducedTreeNode = treeNode.children.reduce((acc, node) => {
    if (node.folder) {
      acc.push({
        ...node,
        children: []
      });
      return acc;
    }
    if (node.originalTitle) {
      acc.push({ ...node });
      return acc;
    }
    const originalTitle = node.title;
    const titleHTML = /* @html */`
        <div class="bookmark-title">
          ${node.title}
        </div>
        <div class="bookmark-url">
          ${node.url}
        </div>
    `;
    acc.push({
      ...node,
      title: titleHTML,
      originalTitle
    });
    return acc;
  }, []);
  return reducedTreeNode;
}

export function removeChildren(indexString, tree) {
  const selectedNode = getNodeByIndex(indexString, tree);
  return filterOutChildren(selectedNode);
}
