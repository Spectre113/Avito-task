import { Spinner } from '../../Spinner/Spinner';
import type { ItemsListProps } from '../ItemsListProps';
import { ItemCard } from '../../ItemCard/ItemCard';
import './ItemsList.css';

export const ItemsList = ({
  items,
  isLoading,
  onCardClick,
}: ItemsListProps) => {
  if (isLoading) return <Spinner />;

  return (
    <ul className="flex list-reset items-list">
      {items.map((item) => (
        <li key={item.id} className="items-list__item">
          <ItemCard
            category={item.category}
            title={item.title}
            price={item.price}
            needsRevision={item.needsRevision}
            onClick={() => onCardClick?.(item.id)}
            variant="list"
          />
        </li>
      ))}
    </ul>
  );
};
