import { last, isEmpty } from 'lodash';
import { getNodeByIndex } from './getNodeByIndex';

export function getNewIndex(node, remoteBookmarks) {
  // console.log('node in get NewIndex', node);
  const bookmarkNode = getNodeByIndex(node.data.index, remoteBookmarks);
  // console.log('bookmarkNode', bookmarkNode);
  let nextIndex = 0;

  if (!isEmpty(bookmarkNode.children)) {
    nextIndex = Number(last(last(bookmarkNode.children).index.split('.'))) + 1;
  }
  return `${node.data.index}.${nextIndex}`;
}
