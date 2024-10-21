import type { SchemaTreeItemContext, TreeItemRenderProps } from "./types";

export function treeItemContextFactory(
  renderProps: TreeItemRenderProps,
): SchemaTreeItemContext {
  const state = {
    renderProps,

    get treeItem() {
      return renderProps.item;
    },

    get treeItemData() {
      return renderProps.item.data;
    },
  };

  return {
    state,

    actions: {
      updateRenderProps(props) {
        state.renderProps = props;
      },
    },
  };
}
