import type { ClickedElementInfo } from "../App";

interface DebugPanelProps {
  clickedElement: ClickedElementInfo | null;
}

export default function DebugPanel({ clickedElement }: DebugPanelProps) {
  return (
    <div className="w-[300px] bg-gray-200 h-full hidden md:block overflow-y-auto">
      <div className="p-4">
        {clickedElement ? (
          <div className="space-y-4">
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
                    <code className="bg-gray-100 px-1 rounded">
                      {clickedElement.className}
                    </code>
                  </div>
                )}
                {clickedElement.textContent && (
                  <div className="mt-2">
                    <span className="font-medium">テキスト:</span>
                    <div className="bg-gray-100 px-1 rounded mt-1 break-words">
                      {clickedElement.textContent}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {Object.keys(clickedElement.attributes).length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  属性
                </h3>
                <div className="bg-white p-3 rounded text-xs space-y-1 max-h-40 overflow-y-auto">
                  {Object.entries(clickedElement.attributes).map(
                    ([key, value]) => (
                      <div key={key} className="break-words">
                        <span className="font-medium">{key}:</span>{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {value}
                        </code>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {clickedElement.computedStyles && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  スタイル
                </h3>
                <div className="bg-white p-3 rounded text-xs space-y-1 max-h-60 overflow-y-auto">
                  {Object.entries(clickedElement.computedStyles).map(
                    ([key, value]) => (
                      <div key={key} className="break-words">
                        <span className="font-medium">{key}:</span>{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {value}
                        </code>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Editor内の要素をクリックすると、ここに情報が表示されます。
          </div>
        )}
      </div>
    </div>
  );
}
