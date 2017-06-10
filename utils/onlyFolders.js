// function removeFilesFromChildren(treeNode) {
//   return treeNode.reduce((acc, element) => {
//     if (element.folder) {
//       acc.push(removeFilesFromChildren(treeNode.children));
//       return acc;
//     }
//     return acc;
//   });
// }


export function onlyFolders(treeNode) {
  return treeNode.reduce((acc, element) => {
    if (element.folder) {
      if (element.children) {
        const sanitizedElement = {
          ...element,
          children: onlyFolders(element.children)
        };
        if (sanitizedElement.children.length === 0) {
          delete sanitizedElement.children;
        }
        acc.push(sanitizedElement);
        return acc;
      }
      acc.push({
        ...element
      });
      return acc;
    }
    return acc;
  }, []);
}
