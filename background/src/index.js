/* global chrome window */
import { isNil } from 'lodash';
import fb from './db';
// import { mapToStdOutput } from './utils';
//
// let localChromeBookmarks;
// let syncMarks;
const shared = {};
shared.fb = fb;
console.log('im in the background page!');

chrome.storage.local.get('syncProfile', (storageItem) => {
  console.log('storageItem', storageItem);
  shared.syncProfile = storageItem.syncProfile;
  if (!isNil(storageItem.syncProfile)) {
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
window.shared = shared;
