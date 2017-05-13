/* global $ document */
import { SYNC_OPTIONS } from './constants';
import { closeSyncModal } from './index';

function setSyncOptionClickHandlers() {
  SYNC_OPTIONS.forEach(syncOption => {
    $(document).on('click', `.sync-option-${syncOption}`, () => {
      closeSyncModal();
      console.log(`${syncOption} option was chosen`);
      switch (syncOption) {
        case 'exchange':
          console.log('exchange was called');
          // syncBookmarks();
          break;
        case 'push':
          // pushToDb();
          break;
        default:
          // @TODO
          break;
      }
    });
  });
}

export default setSyncOptionClickHandlers;
