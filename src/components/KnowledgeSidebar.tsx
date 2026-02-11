import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DocumentType, Direction, FolderNode } from '@/types/knowledge';

interface KnowledgeSidebarProps {
  selectedDirection: Direction;
  selectedSection: DocumentType;
  searchQuery: string;
  folderStructure: FolderNode[];
  expandedFolders: Set<string>;
  selectedDocument: string | null;
  editingNode: { id: string; name: string; type: 'folder' | 'document' } | null;
  setSelectedDirection: (direction: Direction) => void;
  setSelectedSection: (section: DocumentType) => void;
  setSearchQuery: (query: string) => void;
  toggleFolder: (folderId: string) => void;
  setSelectedDocument: (id: string | null) => void;
  setEditingNode: (node: { id: string; name: string; type: 'folder' | 'document' } | null) => void;
  handleRename: (nodeId: string, newName: string) => void;
  handleDelete: (nodeId: string) => void;
  setShowAddDialog: (dialog: { parentId: string | null; type: 'folder' | 'document' } | null) => void;
  setShowFlowEditor: (show: boolean) => void;
  showFlowEditor: boolean;
}

const KnowledgeSidebar = ({
  selectedDirection,
  selectedSection,
  searchQuery,
  folderStructure,
  expandedFolders,
  selectedDocument,
  editingNode,
  setSelectedDirection,
  setSelectedSection,
  setSearchQuery,
  toggleFolder,
  setSelectedDocument,
  setEditingNode,
  handleRename,
  handleDelete,
  setShowAddDialog,
  setShowFlowEditor,
  showFlowEditor,
}: KnowledgeSidebarProps) => {
  const renderFolderTree = (nodes: FolderNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`group flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors ${
            selectedDocument === node.id ? 'bg-accent' : ''
          }`}
        >
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer"
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.id);
              } else {
                setSelectedDocument(node.id);
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                <Icon
                  name={expandedFolders.has(node.id) ? 'ChevronDown' : 'ChevronRight'}
                  size={16}
                  className="text-muted-foreground"
                />
                <Icon name="Folder" size={18} className="text-primary" />
              </>
            ) : (
              <>
                <div className="w-4" />
                <Icon name="FileText" size={18} className="text-muted-foreground" />
              </>
            )}
            {editingNode?.id === node.id ? (
              <Input
                value={editingNode.name}
                onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                onBlur={() => handleRename(node.id, editingNode.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(node.id, editingNode.name);
                  if (e.key === 'Escape') setEditingNode(null);
                }}
                className="h-6 text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-medium">{node.name}</span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon name="MoreVertical" size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {node.type === 'folder' && (
                <>
                  <DropdownMenuItem onClick={() => setShowAddDialog({ parentId: node.id, type: 'folder' })}>
                    <Icon name="FolderPlus" size={14} className="mr-2" />
                    Добавить папку
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAddDialog({ parentId: node.id, type: 'document' })}>
                    <Icon name="FilePlus" size={14} className="mr-2" />
                    Добавить документ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setEditingNode({ id: node.id, name: node.name, type: node.type })}>
                <Icon name="Pencil" size={14} className="mr-2" />
                Переименовать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(node.id)} className="text-destructive">
                <Icon name="Trash2" size={14} className="mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div className="animate-accordion-down">{renderFolderTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <aside className="w-80 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="BookOpen" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">База знаний</h1>
            <p className="text-xs text-muted-foreground">ГБУ ЦИР ПК</p>
          </div>
        </div>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по базе знаний..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2">НАПРАВЛЕНИЕ</h3>
          <div className="space-y-1">
            <Button
              variant={selectedDirection === 'safe-city' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedDirection('safe-city')}
            >
              <Icon name="Shield" size={18} className="mr-2" />
              Безопасный город
            </Button>
            <Button
              variant={selectedDirection === 'transport' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedDirection('transport')}
            >
              <Icon name="Bus" size={18} className="mr-2" />
              ИТС
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <Button
            variant={selectedSection === 'instruction' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedSection('instruction')}
          >
            <Icon name="FileText" size={18} className="mr-2" />
            Инструкции
          </Button>
          <Button
            variant={selectedSection === 'process' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedSection('process')}
          >
            <Icon name="GitBranch" size={18} className="mr-2" />
            Процессы
          </Button>
          <Button
            variant={selectedSection === 'document' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedSection('document')}
          >
            <Icon name="File" size={18} className="mr-2" />
            Документы
          </Button>
          <Button
            variant={selectedSection === 'reference' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedSection('reference')}
          >
            <Icon name="Book" size={18} className="mr-2" />
            Справочник
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Структура</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Icon name="Plus" size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowAddDialog({ parentId: null, type: 'folder' })}>
                  <Icon name="FolderPlus" size={14} className="mr-2" />
                  Новая папка
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAddDialog({ parentId: null, type: 'document' })}>
                  <Icon name="FilePlus" size={14} className="mr-2" />
                  Новый документ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {renderFolderTree(folderStructure)}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={() => setShowFlowEditor(!showFlowEditor)}>
          <Icon name="Plus" size={18} className="mr-2" />
          Создать документ
        </Button>
      </div>
    </aside>
  );
};

export default KnowledgeSidebar;
