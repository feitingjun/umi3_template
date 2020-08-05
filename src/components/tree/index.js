import React, { createContext, useState, useEffect, useRef } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import './index.less';

const { Provider, Consumer } = createContext();

const TreeNode = props => {
  const node = useRef(null);

  // 进入时触发
  const onDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
    // 当前元素距离工作区顶部的距离
    const dTop = e.currentTarget.offsetTop - document.documentElement.scrollTop;
    // 当前鼠标位置距离工作区顶部的位置
    const cTop = e.clientY;
    // 当前元素高度
    const h = e.currentTarget.clientHeight;
    if (cTop >= dTop && cTop <= dTop + 5) {
      e.currentTarget.classList.add('i-tree-node-drag-top');
      if (e.currentTarget.classList.contains('i-tree-node-drag-over')) {
        e.currentTarget.classList.remove('i-tree-node-drag-over');
      }
      if (e.currentTarget.classList.contains('i-tree-node-drag-bottom')) {
        e.currentTarget.classList.remove('i-tree-node-drag-bottom');
      }
    }
    if (cTop > dTop + 5 && cTop < dTop + h - 5) {
      e.currentTarget.classList.add('i-tree-node-drag-over');
      if (e.currentTarget.classList.contains('i-tree-node-drag-bottom')) {
        e.currentTarget.classList.remove('i-tree-node-drag-bottom');
      }
      if (e.currentTarget.classList.contains('i-tree-node-drag-top')) {
        e.currentTarget.classList.remove('i-tree-node-drag-top');
      }
    }
    if (cTop >= dTop + h - 5 && cTop < dTop + h) {
      e.currentTarget.classList.add('i-tree-node-drag-bottom');
      if (e.currentTarget.classList.contains('i-tree-node-drag-over')) {
        e.currentTarget.classList.remove('i-tree-node-drag-over');
      }
      if (e.currentTarget.classList.contains('i-tree-node-drag-top')) {
        e.currentTarget.classList.remove('i-tree-node-drag-top');
      }
    }
  };
  const onCurrentDrop = e => {
    // 当前元素距离工作区顶部的距离
    const dTop = e.currentTarget.offsetTop - document.documentElement.scrollTop;
    // 当前鼠标位置距离工作区顶部的位置
    const cTop = e.clientY;
    // 当前元素高度
    const h = e.currentTarget.clientHeight;
    if (cTop >= dTop && cTop <= dTop + 5) {
      return { type: 'top', id: props.id };
    }
    if (cTop > dTop + 5 && cTop < dTop + h - 5) {
      return { type: 'over', id: props.id };
    }
    if (cTop >= dTop + h - 5 && cTop < dTop + h) {
      return { type: 'bottom', id: props.id };
    }
  };
  const removeClass = e => {
    if (e.currentTarget.classList.contains('i-tree-node-drag-top')) {
      e.currentTarget.classList.remove('i-tree-node-drag-top');
    }
    if (e.currentTarget.classList.contains('i-tree-node-drag-bottom')) {
      e.currentTarget.classList.remove('i-tree-node-drag-bottom');
    }
    if (e.currentTarget.classList.contains('i-tree-node-drag-over')) {
      e.currentTarget.classList.remove('i-tree-node-drag-over');
    }
  };
  // 离开时触发
  const onDragLeave = e => {
    removeClass(e);
    e.stopPropagation();
  };
  return (
    <Consumer>
      {({
        expandedIds,
        selectedIds,
        clickTreeNode,
        onDragStart,
        onDragEnd,
        onDrop,
      }) => {
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
              draggable
              onDragStart={e => {
                onDragStart(props.id, e);
              }}
              onDragEnd={e => {
                onDragEnd(props.id, e);
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={e => {
                const values = onCurrentDrop(e);
                removeClass(e);
                onDrop(values);
              }}
              className={`i-tree-node-title ${
                selectedIds.indexOf(props.id) > -1
                  ? 'i-tree-node-title-selected'
                  : ''
              }`}
              onClick={e => {
                clickTreeNode(props.id, e);
              }}
            >
              {props.children.length > 0 ? (
                <CaretRightOutlined
                  className={`i-tree-node-title-icon ${
                    expand ? 'i-tree-node-title-icon-expand' : ''
                  }`}
                />
              ) : (
                <span className="i-tree-node-title-icon-block"></span>
              )}
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
  const [currentDarg, setCurrentDarg] = useState(null);
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
        onDragStart: (id, e) => {
          setCurrentDarg(id);
        },
        onDragEnd: (id, e) => {
          // setCurrentDarg(null)
        },
        onDrop: (values, e) => {
          if (props.onDrop && typeof props.onDrop === 'function') {
            props.onDrop(currentDarg, values);
          }
        },
      }}
    >
      <div className="i-tree">{props.children}</div>
    </Provider>
  );
};

export { TreeNode };
