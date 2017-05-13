/* global $ vex */
import { SYNC_OPTIONS } from './constants';

function displaySyncOptionsModal(clientProfile) {
  const vexModal = vex.dialog.alert();
  const $syncElements = SYNC_OPTIONS.map(option => {
    const isSelected = option === clientProfile ? 'selected' : '';
    const syncOption = `sync-option-${option}`;
    const syncImage = `sync-image-${option}`;
    return /* @html */`
      <div class=${syncOption} id=${isSelected}>
        <div class="bookmark-image"></div>
        <div class=${syncImage}></div>
        <div class="cloud-image"></div>
      </div>
    `;
  });
  const $syncContainer = /* @html */`
    <div class="sync-options-container"></div>
  `;

  $(vexModal.contentEl).prepend(
    $($syncContainer).append($syncElements)
  );
  const $buttons = $('.vex-dialog-buttons').detach();
  console.log('$buttons', $buttons);
  return vexModal;
}

export default displaySyncOptionsModal;
