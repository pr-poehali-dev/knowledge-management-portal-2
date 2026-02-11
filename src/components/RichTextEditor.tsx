import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1 border-r pr-2">
          <Select onValueChange={setFontFamily}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Шрифт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
              <SelectItem value="'IBM Plex Sans', sans-serif">IBM Plex Sans</SelectItem>
              <SelectItem value="'Georgia', serif">Georgia</SelectItem>
              <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
              <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
              <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setFontSize}>
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder="Размер" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12</SelectItem>
              <SelectItem value="14px">14</SelectItem>
              <SelectItem value="16px">16</SelectItem>
              <SelectItem value="18px">18</SelectItem>
              <SelectItem value="20px">20</SelectItem>
              <SelectItem value="24px">24</SelectItem>
              <SelectItem value="32px">32</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Bold" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Italic" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Underline" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Strikethrough" size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="AlignLeft" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="AlignCenter" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="AlignRight" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="AlignJustify" size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 px-2"
          >
            H1
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 px-2"
          >
            H2
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 px-2"
          >
            H3
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="List" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="ListOrdered" size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Minus" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Quote" size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('code') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Code" size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <label htmlFor="text-color" className="text-xs font-medium">Цвет:</label>
            <input
              id="text-color"
              type="color"
              onInput={(e) => setColor((e.target as HTMLInputElement).value)}
              className="h-8 w-12 rounded border cursor-pointer"
            />
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Undo" size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
          >
            <Icon name="Redo" size={16} />
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;