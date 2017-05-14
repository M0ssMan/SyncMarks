/* global vex chrome */

import displaySyncOptionsModal from './displaySyncOptionsModal';
import { highlightSelectedProfile, setSyncModal, setCurrentProfile } from './index';

function displaySyncWarnModal(profileOptionToUpdate) {
  vex.dialog.confirm({
    unsafeMessage: 'Another profile is already being synced with this computer.<br/>' +
    'Switching profiles will cause all bookmarks' +
    'associated with the previously synced profile to be removed.<br />' +
    'Are you sure you want to proceed?',
    callback: (hasConfirmed) => {
      // @TODO
      if (hasConfirmed) {
        setCurrentProfile(profileOptionToUpdate);
        // setClientProfile(profileOptionToUpdate);
        highlightSelectedProfile(profileOptionToUpdate);
        const syncModal = displaySyncOptionsModal();
        setSyncModal(syncModal);
        // TODO remove all current bookmarks
      }
    }
  });
}


export default displaySyncWarnModal;
