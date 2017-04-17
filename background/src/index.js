/* global chrome window */
import { isEmpty, isNil } from 'lodash';
// import { mapToStdOutput } from './utils';
//
// let localChromeBookmarks;
// let syncMarks;

console.log('im in the background page!');

chrome.storage.local.get('syncProfile', (storageItem) => {
  console.log('storageItem', storageItem);
  window.profileToSync = storageItem.profileToSync;
  if (!isNil(storageItem.profileToSync)) {
    // check if local is synced with db
    // chrome.tabs.create({ url: 'profiles/index.html' })
  }
});

// chrome.bookmarks.getTree((bkTree) => {
//   console.log('bookmark tree', bkTree);
//   // localChromeBookmarks = bkTree;
//   // syncMarks = mapToStdOutput(localChromeBookmarks);
//   // console.log('std output', syncMarks);
// });

// function openProfile() {
//   console.log('open profile ran');
//   chrome.tabs.create({ url: '../bookmarks/index.html' });
// }
//
// function linkProfile() {
//   chrome.tabs.create({ url: '../profiles/index.html'})
// }
//
// function syncProfile() {
//   // to do
// }
//
// function pushToDb() {
//   console.log('pushToDb was executed');
//   // to do
// }
//
// function pullFromDb() {
//   // to do
// }
