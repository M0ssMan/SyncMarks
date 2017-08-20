/* global window document $ chrome */

import { onlyFolders } from './toolkit';
import { contextMenuConfig } from './contextMenuConfig';
import { handleFolderClick } from './handleFolderClick';

const {
  getRemoteBookmarks
} = chrome.extension.getBackgroundPage().shared;

const test = [
  { title: 'yo', key: '1' },
  { title: 'meya', key: '2' },
  { title: 'captainJack', key: '3' },
  { title: 'imaFolder',
    key: '4',
    folder: true
    // unselectable: true,
    // children: [
    //   { title: 'imfucking awesome', key: '4.0'},
    //   { title: 'no seriously...', key: '4.1'},
    //   { title: 'i rule', folder: true ,key: '4.2'},
    //   { title: 'apple', key: '4.3'}
    // ]
  }
]

function initBookmarksScene() {
  const remoteBookmarks = getRemoteBookmarks();
  console.log('remoteBookmarks', remoteBookmarks);
  const onlyFoldersTree = onlyFolders(remoteBookmarks);
  $('.folder-tree').fancytree({
    extensions: ['dnd5', 'syncmarks', 'contextMenu', 'edit'],
    source: onlyFoldersTree,
    checkbox: true,
    contextMenu: contextMenuConfig,
    click: handleFolderClick,
    edit: {
      save(event, data) {
        console.log('value', data.input.val());
        return true;
      }
    },
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
      }
    }
  });
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
