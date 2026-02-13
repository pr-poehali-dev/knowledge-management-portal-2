import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DocumentContent, TableRow, FolderNode, DocumentVersion, DocumentMetrics as MetricsType, DocumentAttachment } from '@/types/knowledge';
import RelatedDocuments from './RelatedDocuments';
import VersionHistory from './VersionHistory';
import DocumentMetrics from './DocumentMetrics';
import FileAttachments from './FileAttachments';
import RichTextEditor from './RichTextEditor';

interface DocumentEditorProps {
  documentId: string;
  documentName: string;
  content: DocumentContent;
  onSave: (content: DocumentContent) => void;
  onClose: () => void;
  allDocuments?: FolderNode[];
  onOpenDocument?: (docId: string) => void;
  versions?: DocumentVersion[];
  metrics?: MetricsType;
  attachments?: DocumentAttachment[];
  onUpdateVersions?: (versions: DocumentVersion[]) => void;
  onUpdateMetrics?: (metrics: MetricsType) => void;
  onUpdateAttachments?: (attachments: DocumentAttachment[]) => void;
  onRename?: (newName: string) => void;
}

const DocumentEditor = ({ 
  documentName, 
  content, 
  onSave, 
  onClose,
  allDocuments = [],
  onOpenDocument,
  versions = [],
  metrics,
  attachments = [],
  onUpdateVersions,
  onUpdateMetrics,
  onUpdateAttachments,
  onRename
}: DocumentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<DocumentContent>(content);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(documentName);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    setEditedName(documentName);
  }, [documentName]);

  const handleNameSave = () => {
    if (onRename && editedName.trim()) {
      onRename(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
    
    if (onUpdateMetrics && metrics) {
      onUpdateMetrics({
        ...metrics,
        updatedAt: new Date().toLocaleDateString('ru-RU'),
        editCount: metrics.editCount + 1
      });
    }
  };

  const handleAddRelatedDoc = (docId: string) => {
    const relatedDocs = editedContent.relatedDocuments || [];
    setEditedContent({
      ...editedContent,
      relatedDocuments: [...relatedDocs, docId]
    });
  };

  const handleRemoveRelatedDoc = (docId: string) => {
    const relatedDocs = editedContent.relatedDocuments || [];
    setEditedContent({
      ...editedContent,
      relatedDocuments: relatedDocs.filter(id => id !== docId)
    });
  };

  const handleSaveVersion = (comment: string) => {
    if (!onUpdateVersions) return;
    const newVersion: DocumentVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toLocaleString('ru-RU'),
      author: 'Текущий пользователь',
      content: editedContent,
      comment
    };
    onUpdateVersions([...versions, newVersion]);
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    setEditedContent(version.content);
    onSave(version.content);
  };

  const handleAddAttachment = (file: File) => {
    if (!onUpdateAttachments) return;
    const fileType = file.name.endsWith('.pdf') ? 'pdf' :
                     file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'word' :
                     file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ? 'excel' :
                     file.type.startsWith('image/') ? 'image' : 'other';
    
    const newAttachment: DocumentAttachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      type: fileType,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleDateString('ru-RU'),
      uploadedBy: 'Текущий пользователь'
    };
    onUpdateAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!onUpdateAttachments) return;
    onUpdateAttachments(attachments.filter(att => att.id !== attachmentId));
  };

  const handleDownloadAttachment = (attachment: DocumentAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  };

  const handleExport = (format: 'pdf' | 'word' | 'excel') => {
    const text = editedContent.text;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentName}.${format === 'word' ? 'doc' : format === 'excel' ? 'xlsx' : 'pdf'}`;
    link.click();
    setShowExportMenu(false);
  };

  const addTable = () => {
    const newTable: TableRow[] = [
      { cells: [{ content: 'Заголовок 1' }, { content: 'Заголовок 2' }, { content: 'Заголовок 3' }] },
      { cells: [{ content: '' }, { content: '' }, { content: '' }] }
    ];
    setEditedContent({
      ...editedContent,
      tables: [...editedContent.tables, newTable]
    });
  };

  const addRow = (tableIndex: number) => {
    const tables = [...editedContent.tables];
    const colCount = tables[tableIndex][0].cells.length;
    tables[tableIndex].push({
      cells: Array(colCount).fill(null).map(() => ({ content: '' }))
    });
    setEditedContent({ ...editedContent, tables });
  };

  const addColumn = (tableIndex: number) => {
    const tables = [...editedContent.tables];
    tables[tableIndex] = tables[tableIndex].map(row => ({
      cells: [...row.cells, { content: '' }]
    }));
    setEditedContent({ ...editedContent, tables });
  };

  const removeRow = (tableIndex: number, rowIndex: number) => {
    const tables = [...editedContent.tables];
    if (tables[tableIndex].length > 1) {
      tables[tableIndex].splice(rowIndex, 1);
      setEditedContent({ ...editedContent, tables });
    }
  };

  const removeColumn = (tableIndex: number, colIndex: number) => {
    const tables = [...editedContent.tables];
    if (tables[tableIndex][0].cells.length > 1) {
      tables[tableIndex] = tables[tableIndex].map(row => ({
        cells: row.cells.filter((_, i) => i !== colIndex)
      }));
      setEditedContent({ ...editedContent, tables });
    }
  };

  const removeTable = (tableIndex: number) => {
    const tables = [...editedContent.tables];
    tables.splice(tableIndex, 1);
    setEditedContent({ ...editedContent, tables });
    setSelectedTable(null);
  };

  const updateCellContent = (tableIndex: number, rowIndex: number, cellIndex: number, value: string) => {
    const tables = [...editedContent.tables];
    tables[tableIndex][rowIndex].cells[cellIndex].content = value;
    setEditedContent({ ...editedContent, tables });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') {
                      setEditedName(documentName);
                      setIsEditingName(false);
                    }
                  }}
                  className="h-8 text-lg font-bold"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleNameSave}>
                  <Icon name="Check" size={16} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  setEditedName(documentName);
                  setIsEditingName(false);
                }}>
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 max-w-2xl">
                <h2 className="text-xl font-bold truncate">{documentName}</h2>
                {onRename && (
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                    <Icon name="Pencil" size={14} />
                  </Button>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Режим редактирования' : 'Режим просмотра'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <Icon name="X" size={18} className="mr-2" />
                Отмена
              </Button>
              <Button onClick={handleSave}>
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
            </>
          ) : (
            <>
              {onUpdateVersions && (
                <VersionHistory
                  versions={versions}
                  currentContent={editedContent}
                  onRestore={handleRestoreVersion}
                  onSaveAsVersion={handleSaveVersion}
                />
              )}
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Icon name="Pencil" size={18} className="mr-2" />
                Редактировать
              </Button>
              <div className="relative">
                <Button variant="outline" onClick={() => setShowExportMenu(!showExportMenu)}>
                  <Icon name="Download" size={18} className="mr-2" />
                  Экспорт
                </Button>
                {showExportMenu && (
                  <Card className="absolute right-0 top-12 z-50 p-2 w-40">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('pdf')}>
                      <Icon name="FileText" size={14} className="mr-2" />
                      PDF
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('word')}>
                      <Icon name="FileText" size={14} className="mr-2" />
                      Word
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('excel')}>
                      <Icon name="Table" size={14} className="mr-2" />
                      Excel
                    </Button>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Текст документа</label>
                  <RichTextEditor
                    content={editedContent.text}
                    onChange={(text) => setEditedContent({ ...editedContent, text })}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Таблицы</h3>
                    <Button onClick={addTable} size="sm">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить таблицу
                    </Button>
                  </div>

                  {editedContent.tables.map((table, tableIndex) => (
                    <Card key={tableIndex} className="p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Таблица {tableIndex + 1}</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTable(selectedTable === tableIndex ? null : tableIndex)}
                          >
                            <Icon name={selectedTable === tableIndex ? 'ChevronUp' : 'ChevronDown'} size={14} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addRow(tableIndex)}>
                            <Icon name="Plus" size={14} className="mr-1" />
                            Строка
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addColumn(tableIndex)}>
                            <Icon name="Plus" size={14} className="mr-1" />
                            Столбец
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => removeTable(tableIndex)}>
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>

                      {(selectedTable === tableIndex || selectedTable === null) && (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <tbody>
                              {table.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.cells.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border p-2">
                                      <Input
                                        value={cell.content}
                                        onChange={(e) =>
                                          updateCellContent(tableIndex, rowIndex, cellIndex, e.target.value)
                                        }
                                        className="h-8 text-sm"
                                      />
                                    </td>
                                  ))}
                                  <td className="border-0 pl-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeRow(tableIndex, rowIndex)}
                                      disabled={table.length <= 1}
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.text }} />

                {content.tables.length > 0 && (
                  <>
                    <Separator />
                    {content.tables.map((table, tableIndex) => (
                      <div key={tableIndex} className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-muted">
                              {table[0].cells.map((cell, i) => (
                                <th key={i} className="border p-3 text-left font-semibold">
                                  {cell.content}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-muted/50">
                                {row.cells.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border p-3">
                                    {cell.content}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </Card>

          {metrics && (
            <div className="mt-6">
              <DocumentMetrics metrics={metrics} />
            </div>
          )}

          {attachments.length > 0 || (isEditing && onUpdateAttachments) ? (
            <div className="mt-6">
              <Card className="p-6">
                <FileAttachments
                  attachments={attachments}
                  onAdd={isEditing ? handleAddAttachment : undefined}
                  onRemove={isEditing ? handleRemoveAttachment : undefined}
                  onDownload={handleDownloadAttachment}
                />
              </Card>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentEditor;