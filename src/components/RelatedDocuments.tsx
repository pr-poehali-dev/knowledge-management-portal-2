import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { FolderNode } from '@/types/knowledge';

interface RelatedDocumentsProps {
  relatedIds: string[];
  allDocuments: FolderNode[];
  onAdd: (docId: string) => void;
  onRemove: (docId: string) => void;
  onOpen: (docId: string) => void;
}

const RelatedDocuments = ({ relatedIds, allDocuments, onAdd, onRemove, onOpen }: RelatedDocumentsProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const relatedDocs = allDocuments.filter(doc => relatedIds.includes(doc.id));
  const availableDocs = allDocuments.filter(
    doc => !relatedIds.includes(doc.id) && 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Связанные документы</h4>
        <Button size="sm" variant="outline" onClick={() => setShowAddDialog(true)}>
          <Icon name="Link" size={14} className="mr-2" />
          Добавить связь
        </Button>
      </div>

      {relatedDocs.length > 0 ? (
        <div className="space-y-2">
          {relatedDocs.map(doc => (
            <Card key={doc.id} className="p-3 hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => onOpen(doc.id)}>
                  <Icon 
                    name={
                      doc.documentType === 'instruction' ? 'FileText' :
                      doc.documentType === 'process' ? 'GitBranch' :
                      doc.documentType === 'document' ? 'File' : 'Book'
                    }
                    size={16}
                    className="text-primary"
                  />
                  <span className="text-sm font-medium">{doc.name}</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {doc.documentType === 'instruction' ? 'Инструкция' :
                     doc.documentType === 'process' ? 'Процесс' :
                     doc.documentType === 'document' ? 'Документ' : 'Справочник'}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onRemove(doc.id)}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Нет связанных документов</p>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить связанный документ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Поиск документа..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {availableDocs.map(doc => (
                  <Card 
                    key={doc.id} 
                    className="p-3 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => {
                      onAdd(doc.id);
                      setShowAddDialog(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={
                          doc.documentType === 'instruction' ? 'FileText' :
                          doc.documentType === 'process' ? 'GitBranch' :
                          doc.documentType === 'document' ? 'File' : 'Book'
                        }
                        size={16}
                        className="text-primary"
                      />
                      <span className="text-sm font-medium">{doc.name}</span>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {doc.documentType === 'instruction' ? 'Инструкция' :
                         doc.documentType === 'process' ? 'Процесс' :
                         doc.documentType === 'document' ? 'Документ' : 'Справочник'}
                      </Badge>
                    </div>
                  </Card>
                ))}
                {availableDocs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Документы не найдены
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatedDocuments;
