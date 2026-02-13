import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DocumentVersion, DocumentContent } from '@/types/knowledge';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  currentContent: DocumentContent;
  onRestore: (version: DocumentVersion) => void;
  onSaveAsVersion: (comment: string) => void;
}

const VersionHistory = ({ versions, currentContent, onRestore, onSaveAsVersion }: VersionHistoryProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [versionComment, setVersionComment] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);

  const handleSaveVersion = () => {
    onSaveAsVersion(versionComment);
    setVersionComment('');
    setShowSaveDialog(false);
  };

  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div>
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>История версий документа</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {sortedVersions.map((version, index) => (
                <Card key={version.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">
                          Последняя
                        </Badge>
                      )}
                      <span className="font-semibold text-sm">{version.timestamp}</span>
                      <span className="text-sm text-muted-foreground">• {version.author}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedVersion(version)}
                    >
                      <Icon name="Eye" size={14} className="mr-2" />
                      Просмотр
                    </Button>
                  </div>
                  {version.comment && (
                    <p className="text-sm text-muted-foreground mt-2">{version.comment}</p>
                  )}
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => {
                        onRestore(version);
                        setShowHistory(false);
                      }}
                    >
                      <Icon name="RotateCcw" size={14} className="mr-2" />
                      Восстановить эту версию
                    </Button>
                  )}
                </Card>
              ))}
              {sortedVersions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  История версий пуста
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedVersion !== null} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Просмотр версии от {selectedVersion?.timestamp}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            {selectedVersion && (
              <div className="prose max-w-none p-4">
                {selectedVersion.content.text.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-2xl font-bold mb-3">{line.substring(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold mb-2 mt-4">{line.substring(3)}</h2>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="mb-2">{line}</p>;
                })}
                
                {selectedVersion.content.tables.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    {selectedVersion.content.tables.map((table, tableIndex) => (
                      <div key={tableIndex} className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-muted">
                              {table[0].cells.map((cell, i) => (
                                <th key={i} className="border p-2 text-left font-semibold">{cell.content}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.cells.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border p-2">{cell.content}</td>
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
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVersion(null)}>
              Закрыть
            </Button>
            {selectedVersion && (
              <Button onClick={() => {
                onRestore(selectedVersion);
                setSelectedVersion(null);
                setShowHistory(false);
              }}>
                <Icon name="RotateCcw" size={14} className="mr-2" />
                Восстановить
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сохранить версию</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к версии</Label>
              <Textarea
                id="comment"
                value={versionComment}
                onChange={(e) => setVersionComment(e.target.value)}
                placeholder="Опишите изменения в этой версии..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveVersion}>
              <Icon name="Save" size={14} className="mr-2" />
              Сохранить версию
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VersionHistory;