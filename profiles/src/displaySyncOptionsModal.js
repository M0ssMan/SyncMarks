/* global $ vex */
import { SYNC_OPTIONS } from './constants';

function displaySyncOptionsModal() {
  const vexModal = vex.dialog.alert();
  const $syncElements = SYNC_OPTIONS.map(option => {
    const syncOption = `sync-option-${option}`;
    const syncImage = `sync-image-${option}`;
    return /* @html */`
      <div class=${syncOption}>
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
  return vexModal;
}

export default displaySyncOptionsModal;
