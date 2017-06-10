/* global jQuery chrome */
/*!
 * jquery.fancytree.syncmarks.js
 *
 * Modifications to how fancytree renders nodes.
 *   - render an unattched checkbox (checking the checkbox does not select the node)
 *   - render title and url from node.data
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2008-2017, Merik Woodmansee (http://github.com/M0ssMan/)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version 1.0
 * @date June 5th 2017
*/

const {
  getClientProfile
} = chrome.extension.getBackgroundPage().shared;
/* eslint-disable no-underscore-dangle */

(($, _) => {
  'use Strict';

  const FT = $.ui.fancytree;
  const TEST_IMG = new RegExp(/\.|\//);
  const REX_HTML = /[&<>"'/]/g;
  const REX_TOOLTIP = /[<>"'/]/g;
  const ENTITY_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };

  function escapeHtml(str) {
    return String(str).replace(REX_HTML, (char) => ENTITY_MAP[char]);
  }

  function escapeTooltip(str) {
    return String(str).replace(REX_TOOLTIP, (char) => ENTITY_MAP[char]);
  }

  FT.registerExtension({
    name: 'syncmarks',
    version: '1.0',
    options: {},

    /*  Initialization  */

    treeInit(...args) {
      this._superApply(args);
      this.$container.addClass("fancytree-ext-syncmarks");
    },

    nodeRenderTitle(ctx, title) {
     // set node connector images, links and text
      let icon;
      let nodeTitle;
      let role;
      let tabindex;
      let tooltip;
      // let checkbox;
      // let className;
      const node = ctx.node;
      const tree = ctx.tree;
      const opts = ctx.options;
      const aria = opts.aria;
      const level = node.getLevel();
      const ares = [];
      const clientProfile = getClientProfile();

      if (title !== undefined) {
        node.title = title;
      }

      if (!node.span || tree._enableUpdate === false) {
        // Silently bail out if node was not rendered yet, assuming
        // node.render() will be called as the node becomes visible
        return;
      }
      // Connector (expanded, expandable or simple)
      role = (aria && node.hasChildren() !== false) ? " role='button'" : "";
      if (level < opts.minExpandLevel) {
        if (!node.lazy) {
          node.expanded = true;
        }
        if (level > 1) {
          const htmlExpander = /* @html */`
            <span ${role} class="fancytree-expander fancytree-expander-fixed"></span>
          `;
          ares.push(htmlExpander);
        }
        // .. else (i.e. for root level) skip expander/connector alltogether
      }
      else {
        const htmlExpander = /* @html */`
          <span ${role} class="fancytree-expander"></span>
        `;
        ares.push(htmlExpander);
      }
      let htmlCheckbox;
      if (node.data.syncedTo[clientProfile]) {
        htmlCheckbox = /* @html */`
        <span class="syncmarks-checkbox synced"></span>
        `;
      }
      else {
        htmlCheckbox = /* @html */`
        <span class="syncmarks-checkbox"></span>
        `;
      }
      ares.push(htmlCheckbox);
      // Checkbox mode
      //  checkbox = FT.evalOption("checkbox", node, node, opts, false);
       //
      //  if( checkbox && !node.isStatusNode() ) {
      //    role = aria ? " role='checkbox'" : "";
      //    className = "fancytree-checkbox";
      //    if( checkbox === "radio" || (node.parent && node.parent.radiogroup) ) {
      //      className += " fancytree-radio";
      //    }
      //    ares.push("<span " + role + " class='" + className + "'></span>");
      //  }


      // Folder or doctype icon
      if (node.data.iconClass !== undefined) {
       // Handle / warn about backward compatibility
        if (node.icon) {
          $.error("'iconClass' node option is deprecated since v2.14.0: use 'icon' only instead");
        }
        else {
          node.warn("'iconClass' node option is deprecated since v2.14.0: use 'icon' instead");
          node.icon = node.data.iconClass;
        }
      }
      // If opts.icon is a callback and returns something other than undefined, use that
      // else if node.icon is a boolean or string, use that
      // else if opts.icon is a boolean or string, use that
      // else show standard icon (which may be different for folders or documents)
      icon = FT.evalOption("icon", node, node, opts, true);
      if (typeof icon !== "boolean") {
       // icon is defined, but not true/false: must be a string
      //  icon = "" + icon;
        icon = String(icon);
      }
      if (icon !== false) {
        role = aria ? " role='presentation'" : "";
        if (typeof icon === "string") {
          if (TEST_IMG.test(icon)) {
            // node.icon is an image url. Prepend imagePath
            icon = (icon.charAt(0) === "/") ? icon : ((opts.imagePath || "") + icon);
            const htmlIcon = /* @html */`
              <img src=${icon} class="fancytree-icon" alt="" />
            `;
            ares.push(htmlIcon);
            // ares.push("<img src='" + icon + "' class='fancytree-icon' alt='' />");
          }
          else {
            const htmlIcon = /* @html */`
              <span ${role} class="fancytree-custom-icon" ${icon} ></span>
            `;
            ares.push(htmlIcon);
            // ares.push("<span " + role + " class='fancytree-custom-icon " + icon +  "'></span>");
          }
        }
        else {
          // standard icon: theme css will take care of this
          const htmlIcon = /* @html */`
            <span ${role} class="fancytree-icon"></span>
          `;
          ares.push(htmlIcon);
          // ares.push("<span " + role + " class='fancytree-icon'></span>");
        }
      }
      // Node title
      nodeTitle = "";
      if (opts.renderTitle) {
        nodeTitle = opts.renderTitle.call(tree, { type: "renderTitle" }, ctx) || "";
      }
      if (!nodeTitle) {
        tooltip = FT.evalOption("tooltip", node, node, opts, null);
        if (tooltip === true) {
          tooltip = node.title;
        }
        if (node.tooltip) {
          tooltip = node.tooltip;
        }
        else if (opts.tooltip) {
          tooltip = opts.tooltip === true ? node.title : opts.tooltip.call(tree, node);
        }
        tooltip = tooltip ? ` title="${escapeTooltip(tooltip)}"` : "";
        tabindex = opts.titlesTabbable ? " tabindex='0'" : "";

        nodeTitle = /* @html */`
          <span class="fancytree-title"${tooltip}${tabindex}>
            ${opts.escapeTitles ? escapeHtml(node.title) : node.title}
          </span>
        `;
        // nodeTitle = "<span class='fancytree-title'" +
        //   tooltip + tabindex + ">" +
        //   (opts.escapeTitles ? escapeHtml(node.title) : node.title) +
        //   "</span>";
      }
      ares.push(nodeTitle);
      // Note: this will trigger focusout, if node had the focus
      // $(node.span).html(ares.join(""));
      // it will cleanup the jQuery data currently associated with SPAN (if any)
      // but it executes more slowly
      node.span.innerHTML = ares.join("");
      // Update CSS classes
      this.nodeRenderStatus(ctx);
      if (opts.enhanceTitle) {
        ctx.$title = $(">span.fancytree-title", node.span);
        nodeTitle = opts.enhanceTitle.call(tree, { type: "enhanceTitle" }, ctx) || "";
      }
    }
  });
})(jQuery);
