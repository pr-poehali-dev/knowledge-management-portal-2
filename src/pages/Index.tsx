import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type DocumentType = 'instruction' | 'process' | 'document' | 'reference';
type Direction = 'safe-city' | 'transport';

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  folder: string;
  author: string;
  lastModified: string;
  tags: string[];
  direction: Direction;
}

interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: FolderNode[];
  documentType?: DocumentType;
  direction: Direction;
}

const Index = () => {
  const [selectedDirection, setSelectedDirection] = useState<Direction>('safe-city');
  const [selectedSection, setSelectedSection] = useState<DocumentType>('instruction');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showFlowEditor, setShowFlowEditor] = useState(false);

  const sampleDocuments: Document[] = [
    {
      id: '1',
      title: 'Настройка серверного оборудования Dell PowerEdge',
      type: 'instruction',
      folder: 'Инфраструктура',
      author: 'Иванов И.И.',
      lastModified: '10.02.2026',
      tags: ['сервер', 'dell', 'настройка'],
      direction: 'safe-city'
    },
    {
      id: '2',
      title: 'Процесс согласования закупки оборудования',
      type: 'process',
      folder: 'Закупки',
      author: 'Петрова А.С.',
      lastModified: '09.02.2026',
      tags: ['закупка', 'согласование', 'оборудование'],
      direction: 'safe-city'
    },
    {
      id: '3',
      title: 'Регламент работы с входящей документацией',
      type: 'document',
      folder: 'Делопроизводство',
      author: 'Сидоров П.К.',
      lastModified: '08.02.2026',
      tags: ['регламент', 'документы'],
      direction: 'transport'
    },
    {
      id: '4',
      title: 'Справочник IP-адресов сетевого оборудования',
      type: 'reference',
      folder: 'Инфраструктура',
      author: 'Козлов Д.В.',
      lastModified: '11.02.2026',
      tags: ['сеть', 'ip', 'оборудование'],
      direction: 'transport'
    },
    {
      id: '5',
      title: 'Инструкция по работе с видеоаналитикой',
      type: 'instruction',
      folder: 'Безопасный город',
      author: 'Смирнов А.П.',
      lastModified: '11.02.2026',
      tags: ['видеоаналитика', 'камеры', 'безопасность'],
      direction: 'safe-city'
    },
    {
      id: '6',
      title: 'Настройка системы управления светофорами',
      type: 'instruction',
      folder: 'ИТС',
      author: 'Морозов В.Л.',
      lastModified: '10.02.2026',
      tags: ['светофоры', 'управление', 'транспорт'],
      direction: 'transport'
    }
  ];

  const folderStructures: Record<Direction, FolderNode[]> = {
    'safe-city': [
      {
        id: '1',
        name: 'Видеонаблюдение',
        type: 'folder',
        direction: 'safe-city',
        children: [
          { id: '1-1', name: 'Настройка камер', type: 'document', documentType: 'instruction', direction: 'safe-city' },
          { id: '1-2', name: 'Видеоаналитика', type: 'document', documentType: 'instruction', direction: 'safe-city' },
          { id: '1-3', name: 'Архив записей', type: 'document', documentType: 'reference', direction: 'safe-city' }
        ]
      },
      {
        id: '2',
        name: 'Системы оповещения',
        type: 'folder',
        direction: 'safe-city',
        children: [
          { id: '2-1', name: 'Настройка громкоговорителей', type: 'document', documentType: 'instruction', direction: 'safe-city' },
          { id: '2-2', name: 'Протоколы оповещения', type: 'document', documentType: 'process', direction: 'safe-city' }
        ]
      },
      {
        id: '3',
        name: 'Инфраструктура',
        type: 'folder',
        direction: 'safe-city',
        children: [
          { id: '3-1', name: 'Серверное оборудование', type: 'document', documentType: 'instruction', direction: 'safe-city' },
          { id: '3-2', name: 'Сетевая инфраструктура', type: 'document', documentType: 'reference', direction: 'safe-city' }
        ]
      }
    ],
    'transport': [
      {
        id: '4',
        name: 'Светофорные объекты',
        type: 'folder',
        direction: 'transport',
        children: [
          { id: '4-1', name: 'Настройка контроллеров', type: 'document', documentType: 'instruction', direction: 'transport' },
          { id: '4-2', name: 'Схемы управления', type: 'document', documentType: 'reference', direction: 'transport' },
          { id: '4-3', name: 'Техническое обслуживание', type: 'document', documentType: 'process', direction: 'transport' }
        ]
      },
      {
        id: '5',
        name: 'Детекторы транспорта',
        type: 'folder',
        direction: 'transport',
        children: [
          { id: '5-1', name: 'Установка датчиков', type: 'document', documentType: 'instruction', direction: 'transport' },
          { id: '5-2', name: 'Калибровка', type: 'document', documentType: 'process', direction: 'transport' }
        ]
      },
      {
        id: '6',
        name: 'АСУДД',
        type: 'folder',
        direction: 'transport',
        children: [
          { id: '6-1', name: 'Настройка центра управления', type: 'document', documentType: 'instruction', direction: 'transport' },
          { id: '6-2', name: 'Алгоритмы управления', type: 'document', documentType: 'reference', direction: 'transport' }
        ]
      }
    ]
  };

  const folderStructure = folderStructures[selectedDirection];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (nodes: FolderNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
            selectedDocument === node.id ? 'bg-accent' : ''
          }`}
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
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div className="animate-accordion-down">
            {renderFolderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const filteredDocuments = sampleDocuments.filter((doc) => {
    const matchesDirection = doc.direction === selectedDirection;
    const matchesSection = doc.type === selectedSection;
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDirection && matchesSection && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Левая боковая панель */}
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
            <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Структура</h3>
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

      {/* Основная область */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold capitalize">
              {selectedSection === 'instruction' && 'Инструкции'}
              {selectedSection === 'process' && 'Бизнес-процессы'}
              {selectedSection === 'document' && 'Документы'}
              {selectedSection === 'reference' && 'Справочник'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'документ' : 'документов'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" size={18} className="mr-2" />
              Фильтры
            </Button>
            <Button variant="outline">
              <Icon name="Download" size={18} className="mr-2" />
              Экспорт
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          {showFlowEditor ? (
            <div className="max-w-6xl mx-auto">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Редактор блок-схем процессов</h3>
                  <Button variant="ghost" onClick={() => setShowFlowEditor(false)}>
                    <Icon name="X" size={18} />
                  </Button>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-12 bg-muted/30">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                      <div className="bg-card border-2 border-primary rounded-lg p-4 w-40 text-center shadow-sm">
                        <Icon name="Circle" size={24} className="mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Начало</p>
                      </div>
                      <Icon name="ArrowRight" size={24} className="self-center text-muted-foreground" />
                      <div className="bg-card border-2 rounded-lg p-4 w-40 text-center shadow-sm">
                        <Icon name="Square" size={24} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Действие</p>
                      </div>
                      <Icon name="ArrowRight" size={24} className="self-center text-muted-foreground" />
                      <div className="bg-card border-2 rounded-lg p-4 w-40 text-center shadow-sm">
                        <Icon name="Diamond" size={24} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Решение</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить блок
                      </Button>
                      <Button variant="outline">
                        <Icon name="Link" size={18} className="mr-2" />
                        Связать элементы
                      </Button>
                      <Button>
                        <Icon name="Save" size={18} className="mr-2" />
                        Сохранить схему
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-3">
                  <Button variant="outline" className="flex-col h-auto py-3">
                    <Icon name="Circle" size={32} className="mb-2" />
                    <span className="text-xs">Начало/Конец</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-3">
                    <Icon name="Square" size={32} className="mb-2" />
                    <span className="text-xs">Процесс</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-3">
                    <Icon name="Diamond" size={32} className="mb-2" />
                    <span className="text-xs">Решение</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-3">
                    <Icon name="Database" size={32} className="mb-2" />
                    <span className="text-xs">Данные</span>
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon
                          name={
                            doc.type === 'instruction'
                              ? 'FileText'
                              : doc.type === 'process'
                              ? 'GitBranch'
                              : doc.type === 'document'
                              ? 'File'
                              : 'Book'
                          }
                          size={20}
                          className="text-primary"
                        />
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {doc.folder}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-2 line-clamp-2">{doc.title}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      <span>{doc.lastModified}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
};

export default Index;