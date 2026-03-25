import type { ItemDetails, ItemUpdateInput } from '../../api/items';

export const mapItemToFormValues = (item: ItemDetails): ItemUpdateInput => {
  if (item.category === 'auto') {
    return {
      category: 'auto',
      title: item.title,
      description: item.description,
      price: item.price,
      params: {
        brand: item.params.brand,
        model: item.params.model,
        yearOfManufacture: item.params.yearOfManufacture,
        transmission: item.params.transmission,
        mileage: item.params.mileage,
        enginePower: item.params.enginePower,
      },
    };
  }

  if (item.category === 'real_estate') {
    return {
      category: 'real_estate',
      title: item.title,
      description: item.description,
      price: item.price,
      params: {
        type: item.params.type,
        address: item.params.address,
        area: item.params.area,
        floor: item.params.floor,
      },
    };
  }

  return {
    category: 'electronics',
    title: item.title,
    description: item.description,
    price: item.price,
    params: {
      type: item.params.type,
      brand: item.params.brand,
      model: item.params.model,
      condition: item.params.condition,
      color: item.params.color,
    },
  };
};
