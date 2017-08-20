/*!
 * jquery.fancytree.edit.js
 *
 * Make node titles editable.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2008-2017, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version 2.23.0
 * @date 2017-05-27T20:09:38Z
 */

/* global jQuery chrome navigator */
/* eslint-disable no-underscore-dangle */

(($, window, document) => {
  "use strict";

// ===============================================
//   Private functions and variables
// ===============================================

  const FT = $.ui.fancytree;
  const isMac = /Mac/.test(navigator.platform);
  const escapeHtml = FT.escapeHtml;
  const unescapeHtml = FT.unescapeHtml;

/**
 * [ext-edit] Start inline editing of current node title.
 *
 * @alias FancytreeNode#editStart
 * @requires Fancytree
 */

  FT._FancytreeNodeClass.prototype.editStart = function editStart() {
    // let $input;
    const node = this;
    const tree = this.tree;
    const local = tree.ext.edit;
    const instOpts = tree.options.edit;
    const $title = $('.syncmarks-title', node.span);
    let $urlInput;
    console.log('node in editStart', node);
    const eventData = {
      node: node,
      tree: tree,
      options: tree.options,
      isNew: $(node[tree.statusClassPropName]).hasClass('fancytree-edit-new'),
      orgTitle: node.title,
      orgUrl: node.data.url,
      input: null,
      dirty: false
    };

    // beforeEdit may want to modify the title before editing
    if (instOpts.beforeEdit.call(node, { type: 'beforeEdit' }, eventData) === false) {
      return false;
    }
    FT.assert(!local.currentNode, 'recursive edit');
    local.currentNode = this;
    local.eventData = eventData;

    // Disable standard Fancytree mouse- and key handling
    tree.widget._unbind();
    // #116: ext-dnd prevents the blur event, so we have to catch outer clicks

    // TODO find out if commenting this out prevents anything
    // $(document).on('mousedown.fancytree-edit', (event) => {
    //   if (!$(event.target).hasClass('fancytree-edit-input')) {
    //     console.log('random document edit end');
    //     node.editEnd(true, event);
    //   }
    // });

    // Replace node with <input>
    const $titleInput = $('<input />', {
      class: 'title-edit-input',
      type: 'text',
      value: tree.options.escapeTitles ? eventData.orgTitle : unescapeHtml(eventData.orgTitle)
    });
    local.eventData.input = $titleInput;
    if (instOpts.adjustWidthOfs != null) {
      $titleInput.width($title.width() + instOpts.adjustWidthOfs);
    }
    if (instOpts.inputCss != null) {
      $titleInput.css(instOpts.inputCss);
    }

    console.log('orgUrl', eventData.orgUrl);
    if (eventData.orgUrl) {
      $urlInput = $('<input />', {
        class: 'url-edit-input',
        type: 'text',
        value: eventData.orgUrl
      });
      $('.syncmarks-url', node.span).css('visibility', 'visible').html($urlInput);
    }

    console.log('does this run');
    $title.html($titleInput);

    console.log('running after this call');
    function attachEventHandlers($elements) {
      $elements
        .focus()
        .change(event => {
          $elements.addClass('edit-dirty');
        })
        .keydown(event => {
          switch (event.which) {
            case $.ui.keyCode.ESCAPE:
              console.log('ending on escape');
              node.editEnd(false, event);
              break;
            case $.ui.keyCode.ENTER:
              console.log('ending on enter');
              node.editEnd(true, event);
              return false; // so we don't start editmode on Mac
            default:
              break;
          }
          event.stopPropagation();
        })
        .blur(event => {
          console.log('event', event);
          const $nextSelection = $(event.relatedTarget);
          if ($nextSelection.is('input')) {
            return;
          }
          console.log('ending on blur');
          return node.editEnd(true, event);
        });
    }

    // Focus <input> and bind keyboard handler
    const allElements = $urlInput ? $titleInput.add($urlInput) : $titleInput;
    attachEventHandlers(allElements);

    instOpts.edit.call(node, { type: 'edit' }, eventData);
  };


/**
 * [ext-edit] Stop inline editing.
 * @param {Boolean} [applyChanges=false] false: cancel edit, true: save (if modified)
 * @alias FancytreeNode#editEnd
 * @requires jquery.fancytree.edit.js
 */
  FT._FancytreeNodeClass.prototype.editEnd = function editEnd(applyChanges, _event) {
    console.log('editEnd was called');
    // let newVal;
    let node = this;
    let tree = this.tree;
    let local = tree.ext.edit;
    let eventData = local.eventData;
    let instOpts = tree.options.edit;
    let $title = $(".fancytree-title", node.span);
    let $titleInput = $title.find("input.title-edit-input");
    let $urlInput = $title.find('input.url-edit-input');

    if (instOpts.trim) {
      $titleInput.val($.trim($titleInput.val()));
      $urlInput.val($.trim($urlInput.val()));
    }
    const newTitleVal = $titleInput.val();
    const newUrlVal = $urlInput.val();

    eventData.dirty = newTitleVal !== node.title && newUrlVal !== node.data.url;
    eventData.originalEvent = _event;

    // Find out, if saving is required
    if (applyChanges === false) {
      // If true/false was passed, honor this (except in rename mode, if unchanged)
      eventData.save = false;
    }
    else if (eventData.isNew) {
      // In create mode, we save everyting, except for empty text
      eventData.save = newTitleVal !== "" && newUrlVal !== "";
    }
    else {
      // In rename mode, we save everyting, except for empty or unchanged text
      eventData.save = eventData.dirty && newTitleVal !== "" && newUrlVal !== "";
    }
    // Allow to break (keep editor open), modify input, or re-define data.save
    if (instOpts.beforeClose.call(node, { type: "beforeClose" }, eventData) === false) {
      return false;
    }
    if (eventData.save && instOpts.save.call(node, { type: "save" }, eventData) === false) {
      return false;
    }
    $titleInput.add($urlInput)
      .removeClass("fancytree-edit-dirty")
      .off();
    // Unbind outer-click handler
    $(document).off(".fancytree-edit");

    if (eventData.save) {
      // # 171: escape user input (not required if global escaping is on)
      node.data.url = newUrlVal;
      node.setTitle(tree.options.escapeTitles ? newTitleVal : escapeHtml(newTitleVal));
      node.setFocus();
    }
    else if (eventData.isNew) {
      node.remove();
      node = null;
      eventData.node = null;
      local.relatedNode.setFocus();
    }
    else {
      node.renderTitle();
      node.setFocus();
    }
    local.eventData = null;
    local.currentNode = null;
    local.relatedNode = null;
    // Re-enable mouse and keyboard handling
    tree.widget._bind();
    // Set keyboard focus, even if setFocus() claims 'nothing to do'
    $(tree.$container).focus();
    eventData.input = null;
    instOpts.close.call(node, { type: "close" }, eventData);
    return true;
  };

/**
* [ext-edit] Create a new child or sibling node and start edit mode.
*
* @param {String} [mode='child'] 'before', 'after', or 'child'
* @param {Object} [init] NodeData (or simple title string)
* @alias FancytreeNode#editCreateNode
* @requires jquery.fancytree.edit.js
* @since 2.4
*/
  FT._FancytreeNodeClass.prototype.editCreateNode = function editCreateNode(mode0, init0) {
    let init = init0;
    let newNode;
    let tree = this.tree;
    let self = this;
    // let init;
    let mode;

    mode = mode0 || "child";
    if (init == null) {
      init = { title: "" };
    }
    else if (typeof init === "string") {
      init = { title: init };
    }
    else {
      FT.assert($.isPlainObject(init));
    }
    // Make sure node is expanded (and loaded) in 'child' mode
    if (mode === "child" && !this.isExpanded() && this.hasChildren() !== false) {
      this.setExpanded().done(() => {
        self.editCreateNode(mode, init);
      });
      return;
    }
    console.log('init', init);
    console.log('mode', mode);
    newNode = this.addNode(init, mode);
    console.log('newNode', newNode);
    // this.addNode(init, mode);
    // newNode = this;

    console.log('this when adding', this);
    // #644: Don't filter new nodes.
    newNode.match = true;
    $(newNode[tree.statusClassPropName])
      .removeClass("fancytree-hide")
      .addClass("fancytree-match");

    newNode.makeVisible(/*{noAnimation: true}*/).done(function(){
      $(newNode[tree.statusClassPropName]).addClass("fancytree-edit-new");
      console.log('self', self);
      self.tree.ext.edit.relatedNode = self;
      newNode.editStart();
    });
  };


/**
 * [ext-edit] Check if any node in this tree  in edit mode.
 *
 * @returns {FancytreeNode | null}
 * @alias Fancytree#isEditing
 * @requires jquery.fancytree.edit.js
 */
$.ui.fancytree._FancytreeClass.prototype.isEditing = function(){
  return this.ext.edit ? this.ext.edit.currentNode : null;
};


/**
 * [ext-edit] Check if this node is in edit mode.
 * @returns {Boolean} true if node is currently beeing edited
 * @alias FancytreeNode#isEditing
 * @requires jquery.fancytree.edit.js
 */
$.ui.fancytree._FancytreeNodeClass.prototype.isEditing = function(){
  return this.tree.ext.edit ? this.tree.ext.edit.currentNode === this : false;
};


/*******************************************************************************
 * Extension code
 */
$.ui.fancytree.registerExtension({
  name: "edit",
  version: "2.23.0",
  // Default options for this extension.
  options: {
    adjustWidthOfs: 4,   // null: don't adjust input size to content
    allowEmpty: false,   // Prevent empty input
    inputCss: {minWidth: "3em"},
    // triggerCancel: ["esc", "tab", "click"],
    // triggerStart: ["f2", "dblclick", "shift+click", "mac+enter"],
    // triggerStart: ["f2", "shift+click", "mac+enter"],
    triggerStart: ["f2"],
    trim: true,          // Trim whitespace before save
    // Events:
    beforeClose: $.noop, // Return false to prevent cancel/save (data.input is available)
    beforeEdit: $.noop,  // Return false to prevent edit mode
    close: $.noop,       // Editor was removed
    edit: $.noop,        // Editor was opened (available as data.input)
//    keypress: $.noop,    // Not yet implemented
    save: $.noop         // Save data.input.val() or return false to keep editor open
  },
  // Local attributes
  currentNode: null,

  treeInit: function(ctx){
    this._superApply(arguments);
    this.$container.addClass("fancytree-ext-edit");
  },
  nodeClick: function(ctx) {
    if( $.inArray("shift+click", ctx.options.edit.triggerStart) >= 0 ){
      if( ctx.originalEvent.shiftKey ){
        ctx.node.editStart();
        return false;
      }
    }
    return this._superApply(arguments);
  },
  nodeDblclick: function(ctx) {
    if( $.inArray("dblclick", ctx.options.edit.triggerStart) >= 0 ){
      ctx.node.editStart();
      return false;
    }
    return this._superApply(arguments);
  },
  nodeKeydown: function(ctx) {
    switch( ctx.originalEvent.which ) {
    case 113: // [F2]
      if( $.inArray("f2", ctx.options.edit.triggerStart) >= 0 ){
        ctx.node.editStart();
        return false;
      }
      break;
    case $.ui.keyCode.ENTER:
      if( $.inArray("mac+enter", ctx.options.edit.triggerStart) >= 0 && isMac ){
        ctx.node.editStart();
        return false;
      }
      break;
    }
    return this._superApply(arguments);
  }
});
})(jQuery, window, document);
