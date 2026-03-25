import './ItemCharacteristics.css';

export interface CharacteristicItem {
  label: string;
  value: string;
}

export interface ItemCharacteristicsProps {
  items: CharacteristicItem[];
}

export const ItemCharacteristics = ({ items }: ItemCharacteristicsProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="flex item-characteristics">
      <h2 className="item-characteristics__title">Характеристики</h2>
      <ul className="list-reset flex item-characteristics__list">
        {items.map((item) => (
          <li key={item.label} className="item-characteristics__item">
            <p className="item-characteristics__label">{item.label}</p>
            <p className="item-characteristics__value">{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
