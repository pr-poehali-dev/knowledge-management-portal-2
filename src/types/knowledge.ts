export type DocumentType = 'instruction' | 'process' | 'document' | 'reference';
export type Direction = 'safe-city' | 'transport';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  folder: string;
  author: string;
  lastModified: string;
  tags: string[];
  direction: Direction;
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: FolderNode[];
  documentType?: DocumentType;
  direction: Direction;
}

export const initialFolderStructures: Record<Direction, FolderNode[]> = {
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
