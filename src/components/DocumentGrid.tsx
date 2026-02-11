import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Document, DocumentType } from '@/types/knowledge';

interface DocumentGridProps {
  selectedSection: DocumentType;
  filteredDocuments: Document[];
  showFlowEditor: boolean;
  setShowFlowEditor: (show: boolean) => void;
}

const DocumentGrid = ({ selectedSection, filteredDocuments, showFlowEditor, setShowFlowEditor }: DocumentGridProps) => {
  return (
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
  );
};

export default DocumentGrid;
