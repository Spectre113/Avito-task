import { Spinner } from '../../Spinner/Spinner';
import type { ItemsListProps } from '../ItemsListProps';
import { ItemCard } from '../../ItemCard/ItemCard';
import './ItemsGrid.css';

export const ItemsGrid = ({
  items,
  isLoading,
  onCardClick,
}: ItemsListProps) => {
  if (isLoading) return <Spinner />;

  return (
    <ul className="list-reset items-grid">
      {items.map((item) => (
        <li key={item.id} className="items-grid__item">
          <ItemCard
            category={item.category}
            title={item.title}
            price={item.price}
            needsRevision={item.needsRevision}
            onClick={() => onCardClick?.(item.id)}
          />
        </li>
      ))}
    </ul>
  );
};
