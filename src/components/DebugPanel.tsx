import { useState, useEffect } from "react";
import type { ClickedElementInfo, DOMTreeNode } from "../App";

interface DebugPanelProps {
  clickedElement: ClickedElementInfo | null;
  onElementClick: (element: ClickedElementInfo | null) => void;
  domTree: DOMTreeNode | null;
}

function formatElement(el: { tagName: string; className: string; id: string }) {
  let str = el.tagName;
  if (el.id) str += `#${el.id}`;
  if (el.className) {
    const classes = el.className.split(" ").slice(0, 2).join(".");
    str += `.${classes}`;
    if (el.className.split(" ").length > 2) str += "...";
  }
  return str;
}

function treeNodeToClickedElement(node: DOMTreeNode): ClickedElementInfo {
  return {
    tagName: node.tagName,
    className: node.className,
    id: node.id,
    textContent: "",
    attributes: {},
    computedStyles: node.computedStyles,
    ancestors: [],
  };
}

// ノードが選択された要素と一致するかチェック
function isNodeSelected(
  node: DOMTreeNode,
  selectedElement: ClickedElementInfo | null
): boolean {
  if (!selectedElement) return false;
  return (
    selectedElement.tagName === node.tagName &&
    selectedElement.className === node.className &&
    selectedElement.computedStyles?.top === node.computedStyles?.top &&
    selectedElement.computedStyles?.left === node.computedStyles?.left
  );
}

// ノードの子孫に選択された要素があるかチェック
function hasSelectedDescendant(
  node: DOMTreeNode,
  selectedElement: ClickedElementInfo | null
): boolean {
  if (!selectedElement) return false;
  if (isNodeSelected(node, selectedElement)) return true;
  return node.children.some((child) =>
    hasSelectedDescendant(child, selectedElement)
  );
}

function TreeNode({
  node,
  depth,
  onElementClick,
  selectedElement,
}: {
  node: DOMTreeNode;
  depth: number;
  onElementClick: (element: ClickedElementInfo | null) => void;
  selectedElement: ClickedElementInfo | null;
}) {
  const hasChildren = node.children.length > 0;
  const isSelected = isNodeSelected(node, selectedElement);
  const hasSelectedChild = hasSelectedDescendant(node, selectedElement);

  // 選択された要素が子孫にある場合は自動展開
  const [isExpanded, setIsExpanded] = useState(depth < 2 || hasSelectedChild);

  // selectedElementが変更されたとき、子孫に選択要素があれば展開
  useEffect(() => {
    if (hasSelectedChild) {
      setIsExpanded(true);
    }
  }, [hasSelectedChild]);

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer hover:bg-blue-50 rounded px-1 -mx-1 ${
          isSelected
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-600"
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onElementClick(treeNodeToClickedElement(node))}
      >
        {hasChildren ? (
          <button
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 mr-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className="w-4 h-4 mr-1" />
        )}
        <span className="truncate">{formatElement(node)}</span>
      </div>
      {isExpanded &&
        node.children.map((child, index) => (
          <TreeNode
            key={index}
            node={child}
            depth={depth + 1}
            onElementClick={onElementClick}
            selectedElement={selectedElement}
          />
        ))}
    </div>
  );
}

export default function DebugPanel({
  clickedElement,
  onElementClick,
  domTree,
}: DebugPanelProps) {
  return (
    <div className="w-[300px] bg-gray-50 h-full hidden md:block overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* 全体ツリー表示 */}
        {domTree && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">ツリー</h3>
            <div className="bg-white p-2 rounded text-xs font-mono max-h-80 overflow-y-auto">
              <TreeNode
                node={domTree}
                depth={0}
                onElementClick={onElementClick}
                selectedElement={clickedElement}
              />
            </div>
          </div>
        )}

        {/* 選択要素の詳細 */}
        {clickedElement && (
          <>
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                基本情報
              </h3>
              <div className="bg-white p-3 rounded text-xs space-y-1">
                <div>
                  <span className="font-medium">タグ:</span>{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    &lt;{clickedElement.tagName}&gt;
                  </code>
                </div>
                {clickedElement.id && (
                  <div>
                    <span className="font-medium">ID:</span>{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {clickedElement.id}
                    </code>
                  </div>
                )}
                {clickedElement.className && (
                  <div>
                    <span className="font-medium">クラス:</span>{" "}
                    <code className="bg-gray-100 px-1 rounded break-all">
                      {clickedElement.className}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {clickedElement.computedStyles && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  スタイル
                </h3>
                <div className="bg-white p-3 rounded text-xs space-y-1">
                  {Object.entries(clickedElement.computedStyles).map(
                    ([key, value]) => (
                      <div key={key} className="break-words">
                        <span className="font-medium">{key}:</span>{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {typeof value === "number" ? Math.round(value) : value}
                        </code>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!clickedElement && !domTree && (
          <div className="text-sm text-gray-500 italic">
            Editor内の要素をクリックすると、ここに情報が表示されます。
          </div>
        )}
      </div>
    </div>
  );
}
