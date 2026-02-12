import { useState } from 'react';
import { DocumentType, Direction, Document, FolderNode, initialFolderStructures, DocumentContent, DocumentVersion, DocumentMetrics, DocumentAttachment } from '@/types/knowledge';
import KnowledgeSidebar from '@/components/KnowledgeSidebar';
import DocumentGrid from '@/components/DocumentGrid';
import AddItemDialog from '@/components/AddItemDialog';
import DocumentEditor from '@/components/DocumentEditor';

const Index = () => {
  const [selectedDirection, setSelectedDirection] = useState<Direction>('safe-city');
  const [selectedSection, setSelectedSection] = useState<DocumentType>('instruction');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [openedDocument, setOpenedDocument] = useState<FolderNode | null>(null);
  const [showFlowEditor, setShowFlowEditor] = useState(false);
  const [folderStructures, setFolderStructures] = useState<Record<Direction, FolderNode[]>>(initialFolderStructures);
  const [editingNode, setEditingNode] = useState<{ id: string; name: string; type: 'folder' | 'document' } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState<{ parentId: string | null; type: 'folder' | 'document' } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDocType, setNewItemDocType] = useState<DocumentType>('instruction');
  const [currentDocType, setCurrentDocType] = useState<DocumentType>('instruction');

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

  const findAndUpdateNode = (
    nodes: FolderNode[],
    nodeId: string,
    updater: (node: FolderNode) => FolderNode | null
  ): FolderNode[] => {
    return nodes
      .map((node) => {
        if (node.id === nodeId) {
          return updater(node);
        }
        if (node.children) {
          return { ...node, children: findAndUpdateNode(node.children, nodeId, updater) };
        }
        return node;
      })
      .filter((node): node is FolderNode => node !== null);
  };

  const findAndAddChild = (nodes: FolderNode[], parentId: string | null, newNode: FolderNode): FolderNode[] => {
    if (parentId === null) {
      return [...nodes, newNode];
    }
    return nodes.map((node) => {
      if (node.id === parentId) {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) {
        return { ...node, children: findAndAddChild(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  const handleRename = (nodeId: string, newName: string) => {
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], nodeId, (node) => ({
        ...node,
        name: newName,
      })),
    });
    setEditingNode(null);
  };

  const handleDelete = (nodeId: string) => {
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], nodeId, () => null),
    });
  };

  const handleAdd = () => {
    if (!showAddDialog || !newItemName.trim()) return;

    const docType = showAddDialog.parentId === null ? currentDocType : newItemDocType;

    const now = new Date().toLocaleDateString('ru-RU');
    const newNode: FolderNode = {
      id: `new-${Date.now()}`,
      name: newItemName,
      type: showAddDialog.type,
      direction: selectedDirection,
      ...(showAddDialog.type === 'folder' ? { children: [] } : { 
        documentType: docType,
        content: { text: '', tables: [] },
        author: 'Текущий пользователь',
        tags: [],
        metrics: {
          views: 0,
          createdAt: now,
          updatedAt: now,
          editCount: 0
        },
        versions: [],
        attachments: []
      }),
    };

    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndAddChild(folderStructures[selectedDirection], showAddDialog.parentId, newNode),
    });

    if (showAddDialog.type === 'document') {
      setSelectedSection(docType);
    }

    setShowAddDialog(null);
    setNewItemName('');
    setNewItemDocType('instruction');

    if (showAddDialog.type === 'document') {
      setTimeout(() => {
        handleOpenDocument(newNode.id);
      }, 100);
    }
  };

  const findNodeById = (nodes: FolderNode[], id: string): FolderNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleOpenDocument = (nodeId: string) => {
    const node = findNodeById(folderStructure, nodeId);
    if (node && node.type === 'document') {
      setOpenedDocument(node);
    }
  };

  const handleSaveDocument = (content: DocumentContent) => {
    if (!openedDocument) return;
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], openedDocument.id, (node) => ({
        ...node,
        content,
      })),
    });
    setOpenedDocument({ ...openedDocument, content });
  };

  const handleUpdateVersions = (versions: DocumentVersion[]) => {
    if (!openedDocument) return;
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], openedDocument.id, (node) => ({
        ...node,
        versions,
      })),
    });
    setOpenedDocument({ ...openedDocument, versions });
  };

  const handleUpdateMetrics = (metrics: DocumentMetrics) => {
    if (!openedDocument) return;
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], openedDocument.id, (node) => ({
        ...node,
        metrics,
      })),
    });
    setOpenedDocument({ ...openedDocument, metrics });
  };

  const handleUpdateAttachments = (attachments: DocumentAttachment[]) => {
    if (!openedDocument) return;
    setFolderStructures({
      ...folderStructures,
      [selectedDirection]: findAndUpdateNode(folderStructures[selectedDirection], openedDocument.id, (node) => ({
        ...node,
        attachments,
      })),
    });
    setOpenedDocument({ ...openedDocument, attachments });
  };

  const getAllDocuments = (nodes: FolderNode[]): FolderNode[] => {
    let docs: FolderNode[] = [];
    for (const node of nodes) {
      if (node.type === 'document') {
        docs.push(node);
      }
      if (node.children) {
        docs = [...docs, ...getAllDocuments(node.children)];
      }
    }
    return docs;
  };

  const allDocuments = getAllDocuments(folderStructure);

  const filteredDocuments = sampleDocuments.filter((doc) => {
    const matchesDirection = doc.direction === selectedDirection;
    const matchesSection = doc.type === selectedSection;
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDirection && matchesSection && matchesSearch;
  });

  const filteredFolderDocuments = allDocuments.filter((doc) => {
    if (!doc.documentType || doc.documentType !== selectedSection) return false;
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    const matchesName = doc.name.toLowerCase().includes(query);
    const matchesContent = doc.content?.text.toLowerCase().includes(query) || false;
    const matchesTags = doc.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
    
    return matchesName || matchesContent || matchesTags;
  });

  return (
    <div className="flex h-screen bg-background">
      <KnowledgeSidebar
        selectedDirection={selectedDirection}
        selectedSection={selectedSection}
        searchQuery={searchQuery}
        folderStructure={folderStructure}
        expandedFolders={expandedFolders}
        selectedDocument={selectedDocument}
        editingNode={editingNode}
        setSelectedDirection={setSelectedDirection}
        setSelectedSection={setSelectedSection}
        setSearchQuery={setSearchQuery}
        toggleFolder={toggleFolder}
        setSelectedDocument={setSelectedDocument}
        setEditingNode={setEditingNode}
        handleRename={handleRename}
        handleDelete={handleDelete}
        setShowAddDialog={setShowAddDialog}
        onOpenDocument={handleOpenDocument}
        currentDocType={currentDocType}
        setCurrentDocType={setCurrentDocType}
      />

      {openedDocument ? (
        <DocumentEditor
          documentId={openedDocument.id}
          documentName={openedDocument.name}
          content={openedDocument.content || { text: '', tables: [] }}
          onSave={handleSaveDocument}
          onClose={() => setOpenedDocument(null)}
          allDocuments={allDocuments}
          onOpenDocument={handleOpenDocument}
          versions={openedDocument.versions || []}
          metrics={openedDocument.metrics}
          attachments={openedDocument.attachments || []}
          onUpdateVersions={handleUpdateVersions}
          onUpdateMetrics={handleUpdateMetrics}
          onUpdateAttachments={handleUpdateAttachments}
        />
      ) : (
        <DocumentGrid
          selectedSection={selectedSection}
          filteredDocuments={filteredDocuments}
          filteredFolderDocuments={filteredFolderDocuments}
          showFlowEditor={showFlowEditor}
          setShowFlowEditor={setShowFlowEditor}
          onOpenDocument={handleOpenDocument}
        />
      )}

      <AddItemDialog
        showAddDialog={showAddDialog}
        newItemName={newItemName}
        newItemDocType={newItemDocType}
        setNewItemName={setNewItemName}
        setNewItemDocType={setNewItemDocType}
        setShowAddDialog={setShowAddDialog}
        handleAdd={handleAdd}
        currentDocType={currentDocType}
      />
    </div>
  );
};

export default Index;