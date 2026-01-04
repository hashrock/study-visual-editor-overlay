import { Button, Card, CheckListItem } from "./ui";

export default function ComponentPalette() {
  return (
    <div className="w-80 ml-8 space-y-4" data-editor-ignore>
      <div className="space-y-2" data-editor-ignore>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="white" className="border border-gray-200">
          White
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>

      <div className="space-y-3" data-editor-ignore>
        <Card variant="default" className="text-sm">
          <p className="text-gray-600">Default Card</p>
        </Card>
        <Card variant="outlined" className="text-sm">
          <p className="text-gray-600">Outlined Card</p>
        </Card>
        <Card variant="highlighted" hover={false} className="text-sm">
          <p className="text-white">Highlighted Card</p>
        </Card>
      </div>

      <ul className="space-y-2" data-editor-ignore>
        <CheckListItem>Default item</CheckListItem>
        <CheckListItem iconSize="sm">Small icon</CheckListItem>
      </ul>
      <div className="bg-blue-600 p-3 rounded-lg" data-editor-ignore>
        <ul className="space-y-2">
          <CheckListItem variant="light">Light variant</CheckListItem>
        </ul>
      </div>
    </div>
  );
}
