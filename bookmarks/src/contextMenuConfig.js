/* global chrome */
import { getNewIndex } from './toolkit';

const {
  getRemoteBookmarks
} = chrome.extension.getBackgroundPage().shared;
const remoteBookmarks = getRemoteBookmarks();

function handleActions(node, action, options) {
  switch (action) {
    case 'addFolder':
      const newNodeIndex = getNewIndex(node, remoteBookmarks);
      node.editCreateNode('child',
        { folder: true,
          title: '',
          index: newNodeIndex
        }
      );
      break;
    case 'edit':
      // TODO add API call
      node.editStart();
      break;
    // case 'cut':
    //   // TODO add API call
    //   cache = node;
    //   node.remove();
    //   break;
    // case 'copy':
    //   // TODO add API call
    //   cache = node;
    //   break;
    // case 'paste':
    //   // TODO add API call
    //   node.addNode([cache]);
    //   break;
    case 'delete':
      // TODO add API call
      node.remove();
      break;
    default:
      break;
  }
}

export const contextMenuConfig = {
  selector: 'fancytree-node',
  menu: {
    edit: { name: 'edit', icon: 'edit' },
    addFolder: { name: 'add Folder', icon: 'fa-folder' },
    // cut: { name: 'cut', icon: 'cut' },
    // copy: { name: 'copy', icon: 'copy' },
    // paste: { name: 'paste', icon: 'paste' },
    delete: { name: 'delete', icon: 'delete' },
    addFile: { name: 'add File', icon: 'fa-file-text-o' },
    link: { name: 'open in tab', icon: 'fa-globe' }
  },
  actions: handleActions
};
