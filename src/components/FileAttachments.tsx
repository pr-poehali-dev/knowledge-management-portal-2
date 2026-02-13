import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentAttachment } from '@/types/knowledge';

interface FileAttachmentsProps {
  attachments: DocumentAttachment[];
  onAdd: (file: File) => void;
  onRemove: (attachmentId: string) => void;
  onDownload: (attachment: DocumentAttachment) => void;
  isEditing?: boolean;
}

const FileAttachments = ({ attachments, onAdd, onRemove, onDownload, isEditing = true }: FileAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'word': return 'FileText';
      case 'excel': return 'Table';
      case 'image': return 'Image';
      default: return 'File';
    }
  };

  const getFileTypeName = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'word': return 'Word';
      case 'excel': return 'Excel';
      case 'image': return 'Изображение';
      default: return 'Файл';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => onAdd(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => onAdd(file));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Прикрепленные файлы</h4>
        {isEditing && (
          <>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="Upload" size={14} className="mr-2" />
              Добавить файл
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
          </>
        )}
      </div>

      {isEditing && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Icon name="Upload" size={32} className="text-muted-foreground" />
            <p className="text-sm font-medium">Перетащите файлы сюда</p>
            <p className="text-xs text-muted-foreground">
              Или нажмите кнопку "Добавить файл" выше
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Поддерживаются: PDF, Word, Excel, изображения
            </p>
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map(attachment => (
            <Card key={attachment.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={getFileIcon(attachment.type)} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeName(attachment.type)}
                      </Badge>
                      <span>{formatFileSize(attachment.size)}</span>
                      <span>•</span>
                      <span>{attachment.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownload(attachment)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Download" size={14} />
                  </Button>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(attachment.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachments;