import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AISearchProps {
  onClose: () => void;
}

const AISearch = ({ onClose }: AISearchProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
          <div>
            <h2 className="text-xl font-bold">Поиск с AI</h2>
            <p className="text-sm text-muted-foreground">
              Умный поиск по всей базе знаний
            </p>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="flex gap-2">
              <Input
                placeholder="Задайте вопрос или опишите, что ищете..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Icon name="Search" size={18} className="mr-2" />
                {isSearching ? 'Поиск...' : 'Найти'}
              </Button>
            </div>
          </Card>

          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin">
                  <Icon name="Loader2" size={48} className="text-primary" />
                </div>
                <p className="text-muted-foreground">Ищу релевантные документы...</p>
              </div>
            </div>
          )}

          {!isSearching && query && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Результаты поиска</h3>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Функция AI-поиска находится в разработке
                </p>
              </Card>
            </div>
          )}

          {!query && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Примеры запросов</h3>
              <div className="grid gap-3">
                <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={() => setQuery('Как настроить камеру видеонаблюдения?')}>
                  <p className="font-medium">Как настроить камеру видеонаблюдения?</p>
                  <p className="text-sm text-muted-foreground mt-1">Найдёт инструкции по настройке оборудования</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={() => setQuery('Процесс согласования закупки')}>
                  <p className="font-medium">Процесс согласования закупки</p>
                  <p className="text-sm text-muted-foreground mt-1">Покажет бизнес-процессы согласования</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={() => setQuery('Регламенты работы с документами')}>
                  <p className="font-medium">Регламенты работы с документами</p>
                  <p className="text-sm text-muted-foreground mt-1">Найдёт документы и регламенты</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default AISearch;
