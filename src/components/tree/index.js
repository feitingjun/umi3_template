import React, { createContext, useState, useEffect, useRef } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import './index.less';

const { Provider, Consumer } = createContext();

const TreeNode = props => {
  const node = useRef(null);
  return (
    <Consumer>
      {({ expandedIds, selectedIds, clickTreeNode }) => {
        const expand = expandedIds.indexOf(props.id) > -1;
        const time = 200;
        if (node.current) {
          let current = node.current;
          if (expand) {
            if (!current.classList.contains('i-tree-node-child-expand')) {
              current.classList.add('i-tree-node-child-expand');
              current.style.height = 'auto';
              const height = window.getComputedStyle(current).height;
              current.style.height = '0';
              current.style.transition = `height ${time}ms linear`;
              setTimeout(() => {
                current.style.height = height;
              }, 0);
              setTimeout(() => {
                current.style.height = 'auto';
              }, time);
            }
          } else {
            if (current.classList.contains('i-tree-node-child-expand')) {
              current.classList.remove('i-tree-node-child-expand');
              const height = window.getComputedStyle(current).height;
              current.style.height = height;
              setTimeout(() => {
                current.style.height = '0px';
              }, 0);
            }
          }
        }

        return (
          <div className="i-tree-node">
            <div
              className={`i-tree-node-title ${
                selectedIds.indexOf(props.id) > -1
                  ? 'i-tree-node-title-selected'
                  : ''
              }`}
              onClick={e => {
                clickTreeNode(props.id, e);
              }}
            >
              <CaretRightOutlined
                className={`i-tree-node-title-icon ${
                  expand ? 'i-tree-node-title-icon-expand' : ''
                }`}
              />
              <span className="i-tree-node-title-name">{props.title}</span>
              {props.rightNode}
            </div>
            <div ref={node} className="i-tree-node-child">
              {props.children}
            </div>
          </div>
        );
      }}
    </Consumer>
  );
};

export default props => {
  const [expandedIds, setExpandedIds] = useState(
    props.defaultExpandedIds || [],
  );
  const [selectedIds, setSelectedIds] = useState(
    props.defaultSelectedIds || [],
  );
  useEffect(() => {
    setExpandedIds(props.expandedIds || props.defaultExpandedIds || []);
  }, [props.expandedIds]);
  useEffect(() => {
    setSelectedIds(props.selectedIds || props.defaultSelectedIds || []);
  }, [props.selectedIds]);

  return (
    <Provider
      value={{
        expandedIds: expandedIds,
        selectedIds: selectedIds,
        clickTreeNode: (id, e) => {
          const eIndex = expandedIds.indexOf(id);
          let eIds = [...expandedIds];
          if (eIndex > -1) {
            eIds = [...eIds.slice(0, eIndex), ...eIds.slice(eIndex + 1)];
          } else {
            eIds.push(id);
          }
          if (props.onExpand && typeof props.onExpand === 'function') {
            props.onExpand(eIds, { id, e });
          }
          if (!props.expandedIds) setExpandedIds(eIds);

          const sIndex = selectedIds.indexOf(id);
          let sIds = [...selectedIds];
          sIds = [id];
          if (props.onSelect && typeof props.onSelect === 'function') {
            props.onSelect(sIds, { id, e });
          }
          if (!props.selectedIds) setSelectedIds(sIds);
        },
      }}
    >
      <div className="i-tree">{props.children}</div>
    </Provider>
  );
};

export { TreeNode };