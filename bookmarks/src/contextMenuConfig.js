let cache;

function handleActions(node, action, options) {
  switch (action) {
    case 'edit':
      // TODO add API call
      break;
    case 'cut':
      // TODO add API call
      cache = node;
      node.remove();
      break;
    case 'copy':
      // TODO add API call
      cache = node;
      break;
    case 'paste':
      // TODO add API call
      node.addNode([cache]);
      break;
    case 'delete':
      // TODO add API call
      node.remove();
      break;
    default:
      break;
  }
}

export const contextMenuConfig = {
  selector: 'fancytree-node',
  menu: {
    edit: { name: 'edit', icon: 'edit' },
    cut: { name: 'cut', icon: 'cut' },
    copy: { name: 'copy', icon: 'copy' },
    paste: { name: 'paste', icon: 'paste' },
    delete: { name: 'delete', icon: 'delete' }
  },
  actions: handleActions
};
