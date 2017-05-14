/* global $ document chrome */
import { isNil } from 'lodash';
import { setSyncModal, getCurrentSelectedProfile } from './index';
import displaySyncOptionsModal from './displaySyncOptionsModal';
import displaySyncWarnModal from './displaySyncWarnModal';

function profileClickEvent(event) {
  const profileOptionToUpdate = $(event.target)
    .closest('.profile-option')
    .find('p')
    .text()
    .toLowerCase();
  const clientProfile = getCurrentSelectedProfile();
  if (isNil(clientProfile) || profileOptionToUpdate === clientProfile) {
    const vexSyncModal = displaySyncOptionsModal(clientProfile);
    setSyncModal(vexSyncModal);
  }
  else {
    displaySyncWarnModal(profileOptionToUpdate);
  }
}

function setProfileClickHandlers() {
  $(document).on('click', '.profile-option',
  profileClickEvent
  );
}

export default setProfileClickHandlers;
