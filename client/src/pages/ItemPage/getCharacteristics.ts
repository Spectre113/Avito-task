import type { ItemDetails } from '../../api/items';

type CharacteristicItem = {
  label: string;
  value: string;
};

type AutoParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

type RealEstateParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

type ElectronicsParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

const isAutoItem = (
  item: ItemDetails,
): item is ItemDetails & { category: 'auto'; params: AutoParams } =>
  item.category === 'auto';

const isRealEstateItem = (
  item: ItemDetails,
): item is ItemDetails & {
  category: 'real_estate';
  params: RealEstateParams;
} => item.category === 'real_estate';

const isElectronicsItem = (
  item: ItemDetails,
): item is ItemDetails & {
  category: 'electronics';
  params: ElectronicsParams;
} => item.category === 'electronics';

const transmissionLabel: Record<'automatic' | 'manual', string> = {
  automatic: 'Автомат',
  manual: 'Механика',
};

const electronicsTypeLabel: Record<'phone' | 'laptop' | 'misc', string> = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
};

const conditionLabel: Record<'new' | 'used', string> = {
  new: 'Новый',
  used: 'Б/у',
};

const realEstateTypeLabel: Record<'flat' | 'house' | 'room', string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
};

export const getCharacteristics = (item: ItemDetails): CharacteristicItem[] => {
  const result: CharacteristicItem[] = [];

  if (isAutoItem(item)) {
    if (item.params.brand) {
      result.push({ label: 'Марка', value: item.params.brand });
    }

    if (item.params.model) {
      result.push({ label: 'Модель', value: item.params.model });
    }

    if (item.params.yearOfManufacture) {
      result.push({
        label: 'Год выпуска',
        value: String(item.params.yearOfManufacture),
      });
    }

    if (item.params.transmission) {
      result.push({
        label: 'Коробка передач',
        value: transmissionLabel[item.params.transmission],
      });
    }

    if (item.params.mileage) {
      result.push({
        label: 'Пробег',
        value: `${item.params.mileage.toLocaleString('ru-RU')} км`,
      });
    }

    if (item.params.enginePower) {
      result.push({
        label: 'Мощность двигателя',
        value: `${item.params.enginePower} л.с.`,
      });
    }

    return result;
  }

  if (isRealEstateItem(item)) {
    if (item.params.type) {
      result.push({
        label: 'Тип',
        value: realEstateTypeLabel[item.params.type],
      });
    }

    if (item.params.address) {
      result.push({ label: 'Адрес', value: item.params.address });
    }

    if (item.params.area) {
      result.push({
        label: 'Площадь',
        value: `${item.params.area} м²`,
      });
    }

    if (item.params.floor) {
      result.push({
        label: 'Этаж',
        value: String(item.params.floor),
      });
    }

    return result;
  }

  if (isElectronicsItem(item)) {
    if (item.params.type) {
      result.push({
        label: 'Тип',
        value: electronicsTypeLabel[item.params.type],
      });
    }

    if (item.params.brand) {
      result.push({ label: 'Бренд', value: item.params.brand });
    }

    if (item.params.model) {
      result.push({ label: 'Модель', value: item.params.model });
    }

    if (item.params.condition) {
      result.push({
        label: 'Состояние',
        value: conditionLabel[item.params.condition],
      });
    }

    if (item.params.color) {
      result.push({ label: 'Цвет', value: item.params.color });
    }

    return result;
  }

  return result;
};
