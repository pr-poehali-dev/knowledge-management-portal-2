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

export interface TableCell {
  content: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  author: string;
  content: DocumentContent;
  comment?: string;
}

export interface DocumentMetrics {
  views: number;
  lastViewed?: string;
  createdAt: string;
  updatedAt: string;
  editCount: number;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'image' | 'other';
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DocumentContent {
  text: string;
  tables: TableRow[][];
  relatedDocuments?: string[];
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: FolderNode[];
  documentType?: DocumentType;
  direction: Direction;
  content?: DocumentContent;
  versions?: DocumentVersion[];
  metrics?: DocumentMetrics;
  attachments?: DocumentAttachment[];
  author?: string;
  tags?: string[];
}

export const initialFolderStructures: Record<Direction, FolderNode[]> = {
  'safe-city': [
    {
      id: '1',
      name: 'Видеонаблюдение',
      type: 'folder',
      direction: 'safe-city',
      children: [
        { 
          id: '1-1', 
          name: 'Настройка камер', 
          type: 'document', 
          documentType: 'instruction', 
          direction: 'safe-city',
          author: 'Иванов И.И.',
          tags: ['видеонаблюдение', 'настройка', 'камеры'],
          metrics: {
            views: 45,
            lastViewed: '11.02.2026',
            createdAt: '01.02.2026',
            updatedAt: '10.02.2026',
            editCount: 3
          },
          content: {
            text: '# Инструкция по настройке камер видеонаблюдения\n\n## Введение\n\nДанная инструкция описывает процедуру установки и настройки IP-камер видеонаблюдения системы "Безопасный город".\n\n## Требования\n\n- Камера должна быть подключена к сети питания\n- Наличие подключения к локальной сети\n- ПО для настройки камер установлено на рабочей станции\n\n## Порядок действий\n\n1. Подключите камеру к источнику питания\n2. Подключите сетевой кабель\n3. Откройте ПО для настройки\n4. Найдите камеру в сети\n5. Задайте параметры согласно таблице ниже',
            tables: [[
              { cells: [{ content: 'Параметр' }, { content: 'Значение' }, { content: 'Примечание' }] },
              { cells: [{ content: 'IP-адрес' }, { content: '192.168.1.x' }, { content: 'Согласно схеме сети' }] },
              { cells: [{ content: 'Маска подсети' }, { content: '255.255.255.0' }, { content: 'Стандартная' }] },
              { cells: [{ content: 'Шлюз' }, { content: '192.168.1.1' }, { content: 'Основной шлюз' }] },
              { cells: [{ content: 'Разрешение' }, { content: '1920x1080' }, { content: 'Full HD' }] },
              { cells: [{ content: 'FPS' }, { content: '25' }, { content: 'Кадров в секунду' }] }
            ]]
          }
        },
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