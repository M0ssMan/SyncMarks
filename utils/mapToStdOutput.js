import { isNil, isArray, pick } from 'lodash';

function traverseTree(originParent, originChild, clonedParent, syncedProfile) {
  if (!isArray(clonedParent.children)) {
    clonedParent.children = [];
  }
  const clonedChild = pick(originChild, ['dateAdded', 'url', 'title', 'parentId']);
  clonedChild.type = !isNil(originChild.url) ? 'file' : 'folder';
  clonedChild.syncedTo = { [syncedProfile]: true };
  clonedParent.children.push(clonedChild);
  if (isArray(originChild.children) && originChild.children.length > 0) {
    originChild.children.forEach(originGrandChild => {
      traverseTree(originChild, originGrandChild, clonedChild, syncedProfile);
    });
  }
}

export function mapToStdOutput(fullChromeBookmarkTree, syncedProfile) {
  const chromeTree = fullChromeBookmarkTree[0];
  const stdTree = pick(chromeTree, ['dateAdded']);
  chromeTree.children.forEach(child => {
    traverseTree(chromeTree, child, stdTree, syncedProfile);
  });
  return stdTree.children;
}
