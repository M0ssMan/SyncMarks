/* global $ document chrome */
import { SYNC_OPTIONS } from './constants';
import { closeSyncModal, getCurrentSelectedProfile } from './index';

const {
  syncBookmarks
} = chrome.extension.getBackgroundPage().shared;

function setSyncOptionClickHandlers() {
  SYNC_OPTIONS.forEach(syncOption => {
    $(document).on('click', `.sync-option-${syncOption}`, () => {
      closeSyncModal();
      const currentProfile = getCurrentSelectedProfile();

      console.log(`${syncOption} option was chosen`);
      switch (syncOption) {
        case 'exchange':
          console.log('exchange was called');
          syncBookmarks(currentProfile);
          break;
        case 'push':
          // TODO
          break;
        default:
          // TODO
          break;
      }
    });
  });
}

export default setSyncOptionClickHandlers;
