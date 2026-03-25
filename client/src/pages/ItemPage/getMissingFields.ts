import type { ItemDetails } from '../../api/items';

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

const isEmptyString = (value: string | undefined): boolean =>
  value === undefined || value.trim().length === 0;

const isEmptyNumber = (value: number | undefined): boolean =>
  value === undefined;

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

export const getMissingFields = (item: ItemDetails): string[] => {
  const missingFields: string[] = [];

  if (isEmptyString(item.description)) {
    missingFields.push('Описание');
  }

  if (isAutoItem(item)) {
    if (isEmptyString(item.params.brand)) {
      missingFields.push('Марка');
    }

    if (isEmptyString(item.params.model)) {
      missingFields.push('Модель');
    }

    if (isEmptyNumber(item.params.yearOfManufacture)) {
      missingFields.push('Год выпуска');
    }

    if (item.params.transmission === undefined) {
      missingFields.push('Коробка передач');
    }

    if (isEmptyNumber(item.params.mileage)) {
      missingFields.push('Пробег');
    }

    if (isEmptyNumber(item.params.enginePower)) {
      missingFields.push('Мощность двигателя');
    }

    return missingFields;
  }

  if (isRealEstateItem(item)) {
    if (item.params.type === undefined) {
      missingFields.push('Тип недвижимости');
    }

    if (isEmptyString(item.params.address)) {
      missingFields.push('Адрес');
    }

    if (isEmptyNumber(item.params.area)) {
      missingFields.push('Площадь');
    }

    if (isEmptyNumber(item.params.floor)) {
      missingFields.push('Этаж');
    }

    return missingFields;
  }

  if (isElectronicsItem(item)) {
    if (item.params.type === undefined) {
      missingFields.push('Тип');
    }

    if (isEmptyString(item.params.brand)) {
      missingFields.push('Бренд');
    }

    if (isEmptyString(item.params.model)) {
      missingFields.push('Модель');
    }

    if (item.params.condition === undefined) {
      missingFields.push('Состояние');
    }

    if (isEmptyString(item.params.color)) {
      missingFields.push('Цвет');
    }

    return missingFields;
  }

  return missingFields;
};
