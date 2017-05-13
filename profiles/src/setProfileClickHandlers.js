/* global $ document */
import { setSyncModal } from './index';
import displaySyncOptionsModal from './displaySyncOptionsModal';
import displaySyncWarnModal from './displaySyncWarnModal';

function setProfileClickHandlers(clientProfile) {
  $(document).on('click', '.profile-option', (event) => {
    console.log('event', event);
    const selectedOption = $(event.target)
      .closest('.profile-option')
      .find('p')
      .text()
      .toLowerCase();
    if (clientProfile === 'NO_PROFILE') {
      const vexSyncModal = displaySyncOptionsModal(clientProfile);
      setSyncModal(vexSyncModal);
    }
    else {
      const vexSyncModal = displaySyncOptionsModal(clientProfile);
      setSyncModal(vexSyncModal);
      // displaySyncWarnModal();
      // @TODO
    }
  });
}

// async function setProfileClickEvent(target) {
//   const selectedOption = $(target)
//     .closest('.profile-option')
//     .find('p')
//     .text()
//     .toLowerCase();
//   if (clientProfile === 'NO_PROFILE') {
//     await setClientProfile(selectedOption);
//   }
// }

export default setProfileClickHandlers;
