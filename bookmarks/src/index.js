/* global window document $ chrome */

import { onlyFolders, removeChildren } from 'utils';
import { isNil } from 'lodash';

const {
  getRemoteBookmarks
} = chrome.extension.getBackgroundPage().shared;

let fileFancyTree;

var test = [
  { title: 'yo', key: '1'},
  { title: 'meya', key: '2'},
  { title: 'captainJack', key: '3'},
  { title: 'imaFolder',
    key: '4',
    folder: true,
    // unselectable: true,
    // children: [
    //   { title: 'imfucking awesome', key: '4.0'},
    //   { title: 'no seriously...', key: '4.1'},
    //   { title: 'i rule', folder: true ,key: '4.2'},
    //   { title: 'apple', key: '4.3'}
    // ]
  }
]

function initFileTree(fileTree) {
  $('.file-tree').fancytree({
    extensions: ['syncmarks'],
    source: fileTree
  });
}

function displayFolderContents(leafNode, remoteBookmarks) {
  leafNode.node.setSelected();
  const shallowTree = removeChildren(leafNode.node.data.index, remoteBookmarks);
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

function initBookmarksScene() {
  const remoteBookmarks = getRemoteBookmarks();
  console.log('remoteBookmarks', remoteBookmarks);
  const onlyFoldersTree = onlyFolders(remoteBookmarks);
  $('.folder-tree').fancytree({
    extensions: ['dnd5', 'syncmarks'],
    source: onlyFoldersTree,
    checkbox: true,
    click: function (event, leafNode) {
      console.log('event', event);
      console.log('leafNode', leafNode);
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
      displayFolderContents(leafNode, remoteBookmarks);
    },
    // edit: {
    //   triggerStart: ['shift+click'],
    //   save(event, data) {
    //     console.log('value', data.input.val());
    //     return true;
    //   }
    // },
    dnd5: {
      scroll: true,
      preventNonNodes: false,
      preventForeignNodes: false,
      preventRecursiveMoves: false,
      // preventVoidMoves: true,
      dragStart: () => true,
      dragEnter: () => {
        return true;
      },
      dragDrop: (node, data) => {
        console.log('node', node);
        console.log('data', data);
        if (data.otherNode) {
          const isSameTree = data.otherNode.tree === node.tree;
          // if (isSameTree) {

            data.otherNode.moveTo(node, data.hitMode)
          // }
          console.log('test array', test);
        }
      },
      nodeRenderTitle: function(evt, data) {
        console.log('evt', evt);
        console.log('data', data);
      }
    }
  });

  // CURRENTLY UNUSED, ONLY FOR REFERENCE TO BE REMOVED
  $('#tree2').fancytree({
    extensions: ['dnd5'],
    source: test,
    checkbox: true,
    // edit: {
    //   triggerStart: ['shift+click'],
    //   save(event, data) {
    //     console.log('value', data.input.val());
    //     return true;
    //   }
    // },
    dnd5: {
      scroll: true,
      // preventNonNodes: true,
      // preventForeignNodes: true,
      preventRecursiveMoves: false,
      // preventVoidMoves: false,
      dragStart: () => true,
      dragEnter: () => true,
      dragDrop: (node, data) => {
        console.log('node', node);
        console.log('data', data);
        if (data.otherNode) {
          const isSameTree = data.otherNode.tree === node.tree;
          if (isSameTree) {

            data.otherNode.moveTo(node, data.hitMode)
          }
          console.log('test array', test);
        }
      },
    },
  })
}

$(document).ready(() => {
  $('.folder-pane').resizable({
    handles: {
      e: $('.splitter')
    },
    maxWidth: 500,
    minWidth: 175
  });
  initBookmarksScene();
});
