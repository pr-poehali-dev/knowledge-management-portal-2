import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { DocumentMetrics as MetricsType } from '@/types/knowledge';

interface DocumentMetricsProps {
  metrics: MetricsType;
}

const DocumentMetrics = ({ metrics }: DocumentMetricsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Eye" size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Просмотры</span>
        </div>
        <p className="text-2xl font-bold">{metrics.views}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Edit" size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Правки</span>
        </div>
        <p className="text-2xl font-bold">{metrics.editCount}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Calendar" size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Создан</span>
        </div>
        <p className="text-sm font-semibold">{metrics.createdAt}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Clock" size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Обновлен</span>
        </div>
        <p className="text-sm font-semibold">{metrics.updatedAt}</p>
      </Card>
    </div>
  );
};

export default DocumentMetrics;
