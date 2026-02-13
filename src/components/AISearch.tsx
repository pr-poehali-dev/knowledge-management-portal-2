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
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="p-6 flex-1 mb-6">
            <div className="h-full p-4 bg-muted/30 rounded-lg">
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={48} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">Ищу релевантные документы...</p>
                  </div>
                </div>
              ) : query ? (
                <p className="text-sm text-muted-foreground">
                  Функция AI-поиска находится в разработке
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Введите запрос ниже для начала поиска
                </p>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-6">
        <div className="max-w-4xl mx-auto">
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
        </div>
      </div>
    </main>
  );
};

export default AISearch;