/* global chrome window */
import { isNil } from 'lodash';
import fb from './db';
import {
  mapToStdOutput,
  mapToChromeOutput,
  check
} from './utils';

console.log('im in the background page!');
let activeProfile;
/* eslint-disable arrow-parens */
chrome.storage.local.get('activeProfile', (storage) => {
  console.log('storage.activeProfile', storage.activeProfile);
  activeProfile = storage.activeProfile || 'NO_PROFILE';
});
/* eslint-enable arrow-parens */

// chrome.bookmarks.getTree(bkTree => {
//   console.log('bookmark tree', bkTree);
//   localChromeBookmarks = bkTree;
//   syncMarks = mapToStdOutput(localChromeBookmarks);
//   console.log('std output', syncMarks);
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

function getChromeProfile() {
  return activeProfile;
}

function getActiveProfile() {
  return check(() => getChromeProfile());
}

function syncBookmarks() {
  let localChromeBookmarks;
  let serverBookmarks;
  chrome.bookmarks.getTree(bkTree => {
    console.log('bookmark tree', bkTree);
    localChromeBookmarks = bkTree;
  });
  fb.getBookmarks()
    .then(bookmarksFromDb => {
      serverBookmarks = bookmarksFromDb;
      console.log('serverBookmarks', serverBookmarks);
    });
  // return check(() => fb.sync());
}

window.shared = {
  getProfiles,
  getActiveProfile,
  pushToDb,
  syncBookmarks
};
