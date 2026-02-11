import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType } from '@/types/knowledge';

interface AddItemDialogProps {
  showAddDialog: { parentId: string | null; type: 'folder' | 'document' } | null;
  newItemName: string;
  newItemDocType: DocumentType;
  setNewItemName: (name: string) => void;
  setNewItemDocType: (type: DocumentType) => void;
  setShowAddDialog: (dialog: { parentId: string | null; type: 'folder' | 'document' } | null) => void;
  handleAdd: () => void;
}

const AddItemDialog = ({
  showAddDialog,
  newItemName,
  newItemDocType,
  setNewItemName,
  setNewItemDocType,
  setShowAddDialog,
  handleAdd,
}: AddItemDialogProps) => {
  return (
    <Dialog open={showAddDialog !== null} onOpenChange={() => setShowAddDialog(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showAddDialog?.type === 'folder' ? 'Новая папка' : 'Новый документ'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={showAddDialog?.type === 'folder' ? 'Название папки' : 'Название документа'}
            />
          </div>
          {showAddDialog?.type === 'document' && (
            <div className="space-y-2">
              <Label htmlFor="doctype">Тип документа</Label>
              <Select value={newItemDocType} onValueChange={(value: DocumentType) => setNewItemDocType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instruction">Инструкция</SelectItem>
                  <SelectItem value="process">Процесс</SelectItem>
                  <SelectItem value="document">Документ</SelectItem>
                  <SelectItem value="reference">Справочник</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddDialog(null)}>
            Отмена
          </Button>
          <Button onClick={handleAdd}>Создать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
