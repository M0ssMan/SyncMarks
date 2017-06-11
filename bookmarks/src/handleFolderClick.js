/* global $ chrome */
import { isNil } from 'lodash';
import { removeChildren } from './toolkit';

const {
  getRemoteBookmarks
} = chrome.extension.getBackgroundPage().shared;
const remoteBookmarks = getRemoteBookmarks();
let fileFancyTree;

function initFileTree(fileTree) {
  $('.file-tree').fancytree({
    extensions: ['syncmarks'],
    source: fileTree
  });
}

function displayFolderContents(folder) {
  console.log('folder', folder);
  folder.node.setSelected();
  const shallowTree = removeChildren(folder.node.data.index, remoteBookmarks);
  console.log('only urls', shallowTree);
  if (isNil(fileFancyTree)) {
    console.log('file tree is undefined and initiated');
    initFileTree(shallowTree);
    fileFancyTree = $('.file-tree').fancytree('getTree');
    fileFancyTree.visit((node) => {
      node.addClass('custom-container');
    });
    return;
  }
  console.log('patching file tree');
  fileFancyTree = $('.file-tree').fancytree('getTree');
  fileFancyTree.reload(shallowTree);
  fileFancyTree.visit((node) => {
    node.addClass('custom-container');
  });
}

export function handleFolderClick(event, node) {
  console.log('event', event);
  console.log('node', node);
  const clickedElement = event.originalEvent.target;
  if ($(clickedElement).hasClass('fancytree-expander')) {
    console.log('you clicked the expander');
    return;
  }
  if ($(clickedElement).hasClass('syncmarks-checkbox')) {
    // TODO add API call
    console.log('toggling class');
    $(clickedElement).toggleClass('synced');
    return;
  }
  displayFolderContents(node);
}
