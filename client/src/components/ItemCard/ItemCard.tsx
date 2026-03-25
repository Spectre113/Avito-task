import type { MouseEventHandler } from 'react';
import './ItemCard.css';
import type { Category } from '../../api/items';

export interface ItemCardProps {
  imageUrl?: string;
  category: Category;
  title: string;
  price: number;
  needsRevision: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'grid' | 'list';
}

const CATEGORY_LABELS: Record<Category, string> = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};

export const ItemCard = ({
  imageUrl,
  category,
  title,
  price,
  onClick,
  needsRevision,
  variant = 'grid',
}: ItemCardProps) => {
  return (
    <button
      className="flex btn-reset item-card"
      onClick={onClick}
      data-variant={variant}
    >
      <img
        src={imageUrl || '/cover.png'}
        alt={title}
        className="item-card__image"
        data-variant={variant}
      />
      <div className="flex item-card__content" data-variant={variant}>
        <p className="item-card__type" data-variant={variant}>
          {CATEGORY_LABELS[category]}
        </p>
        <h3 className="item-card__title" data-variant={variant}>
          {title}
        </h3>
        <p className="item-card__price" data-variant={variant}>
          {price} ₽
        </p>
        {needsRevision && (
          <p className="item-card__revision" data-variant={variant}>
            Требует доработок
          </p>
        )}
      </div>
    </button>
  );
};
