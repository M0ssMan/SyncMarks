/* global $ document chrome */
import { SYNC_OPTIONS } from './constants';
import { closeSyncModal } from './index';

const {
  syncBookmarks
} = chrome.extension.getBackgroundPage().shared;

function setSyncOptionClickHandlers() {
  SYNC_OPTIONS.forEach(syncOption => {
    $(document).on('click', `.sync-option-${syncOption}`, () => {
      closeSyncModal();

      console.log(`${syncOption} option was chosen`);
      switch (syncOption) {
        case 'exchange':
          console.log('exchange was called');
          syncBookmarks('exchange');
          break;
        case 'push':
          console.log('push was called');
          syncBookmarks('push');
          break;
        default:
          // TODO
          break;
      }
    });
  });
}

export default setSyncOptionClickHandlers;
