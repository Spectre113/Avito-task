import './ItemDescription.css';

export interface ItemDescriptionProps {
  description: string;
}

export const ItemDescription = ({ description }: ItemDescriptionProps) => {
  return (
    <div className="flex item-description">
      <h2 className="item-description__title">Описание</h2>
      <p className="item-description__text">
        {description?.trim() || 'Отсутствует'}
      </p>
    </div>
  );
};
