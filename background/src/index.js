/* global chrome window */
import { isNil } from 'lodash';
import fb from './db';
import {
  mapToStdOutput,
  mapToChromeOutput,
  check
} from './utils';

console.log('im in the background page!');
const shared = {};
/* eslint-disable arrow-parens */
chrome.storage.local.get('syncProfile', (storageItem) => {
  console.log('storageItem', storageItem);
  shared.syncProfile = storageItem.syncProfile;
  if (!isNil(storageItem.syncProfile)) {
    // check if local is synced with db
    // chrome.tabs.create({ url: 'profiles/index.html' })
  }
});
/* eslint-enable arrow-parens */

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
function pushToDb() {
  fb.getBookmarks()
    .then(result => {
      chrome.bookmarks.getTree(chromeTree => {
        console.log('chromeTree', chromeTree);
        const syncMarks = mapToStdOutput(chromeTree);
        console.log('syncMarks', syncMarks);
      });
    });
}
function getProfiles() {
  return check(() => fb.getProfiles());
}

window.shared = {
  ...shared,
  getProfiles,
  pushToDb
};
