import { isNil, pick } from 'lodash';

export function mapToStdOutput(treeNode, syncedProfile, fullIndex) {
  return treeNode.reduce((acc, element, index) => {
    const element0 = pick(element, ['dateAdded', 'url', 'title', 'parentId']);
    element0.folder = isNil(element.url);
    element0.syncedTo = { [syncedProfile]: true };
    element0.index = isNil(fullIndex) ? `${index}` : `${fullIndex}.${index}`;
    if (element0.folder) {
      element0.children = mapToStdOutput(element.children, syncedProfile, element.index);
    }
    acc.push(element0);
    return acc;
  }, []);
}
