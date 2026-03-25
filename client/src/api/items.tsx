import { z } from 'zod';

export const CategorySchema = z.enum(['auto', 'real_estate', 'electronics']);
export type Category = z.infer<typeof CategorySchema>;

export const ItemSchema = z.object({
  id: z.number().int().positive(),
  category: CategorySchema,
  title: z.string().min(1, { message: 'Обязательное поле' }),
  price: z.number({ message: 'Обязательное поле' }).nonnegative({
    message: 'Цена не может быть меньше 0',
  }),
  needsRevision: z.boolean(),
});

export type Item = z.infer<typeof ItemSchema>;
export const ItemsListSchema = z.array(ItemSchema);

export const ResponseSchema = z.object({
  items: ItemsListSchema,
  total: z.number().int().nonnegative(),
});

export const ItemsQuerySchema = z.object({
  q: z.string().min(1).optional(),
  limit: z.number().int().positive().optional(),
  skip: z.number().int().nonnegative().optional(),
  needsRevision: z.boolean().optional(),
  categories: z.array(CategorySchema).optional(),
  sortColumn: z.enum(['title', 'createdAt', 'price']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export type ItemsQuery = z.infer<typeof ItemsQuerySchema>;

export const ItemParamsSchema = z.union([
  z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    yearOfManufacture: z.number().int().optional(),
    transmission: z.enum(['automatic', 'manual']).optional(),
    mileage: z.number().int().nonnegative().optional(),
    enginePower: z.number().int().nonnegative().optional(),
  }),
  z.object({
    type: z.enum(['flat', 'house', 'room']).optional(),
    address: z.string().optional(),
    area: z.number().nonnegative().optional(),
    floor: z.number().int().nonnegative().optional(),
  }),
  z.object({
    type: z.enum(['phone', 'laptop', 'misc']).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    condition: z.enum(['new', 'used']).optional(),
    color: z.string().optional(),
  }),
]);

export const AutoItemParamsSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearOfManufacture: z.number().int().optional(),
  transmission: z.enum(['automatic', 'manual']).optional(),
  mileage: z.number().optional(),
  enginePower: z.number().int().optional(),
});

export const RealEstateItemParamsSchema = z.object({
  type: z.enum(['flat', 'house', 'room']).optional(),
  address: z.string().optional(),
  area: z.number().optional(),
  floor: z.number().int().optional(),
});

export const ElectronicsItemParamsSchema = z.object({
  type: z.enum(['phone', 'laptop', 'misc']).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['new', 'used']).optional(),
  color: z.string().optional(),
});

export const ItemDetailsSchema = z.discriminatedUnion('category', [
  z.object({
    id: z.number().int().positive(),
    category: z.literal('auto'),
    title: z.string().min(1),
    description: z.string(),
    price: z.number().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
    params: AutoItemParamsSchema,
    needsRevision: z.boolean(),
  }),
  z.object({
    id: z.number().int().positive(),
    category: z.literal('real_estate'),
    title: z.string().min(1),
    description: z.string(),
    price: z.number().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
    params: RealEstateItemParamsSchema,
    needsRevision: z.boolean(),
  }),
  z.object({
    id: z.number().int().positive(),
    category: z.literal('electronics'),
    title: z.string().min(1),
    description: z.string(),
    price: z.number().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
    params: ElectronicsItemParamsSchema,
    needsRevision: z.boolean(),
  }),
]);

export type ItemDetails = z.infer<typeof ItemDetailsSchema>;

export const ItemUpdateInputSchema = z.discriminatedUnion('category', [
  z.object({
    category: z.literal('auto'),
    title: z.string().min(1, { message: 'Обязательное поле' }),
    description: z.string().optional(),
    price: z
      .number({ message: 'Обязательное поле' })
      .nonnegative({ message: 'Цена не может быть меньше 0' }),
    params: AutoItemParamsSchema,
  }),
  z.object({
    category: z.literal('real_estate'),
    title: z.string().min(1, { message: 'Обязательное поле' }),
    description: z.string().optional(),
    price: z
      .number({ message: 'Обязательное поле' })
      .nonnegative({ message: 'Цена не может быть меньше 0' }),
    params: RealEstateItemParamsSchema,
  }),
  z.object({
    category: z.literal('electronics'),
    title: z.string().min(1, { message: 'Обязательное поле' }),
    description: z.string().optional(),
    price: z
      .number({ message: 'Обязательное поле' })
      .nonnegative({ message: 'Цена не может быть меньше 0' }),
    params: ElectronicsItemParamsSchema,
  }),
]);

export type ItemUpdateInput = z.infer<typeof ItemUpdateInputSchema>;

export const ItemUpdateInputReponseSchema = z.object({
  success: z.boolean(),
});

export type ItemUpdateInputResponse = z.infer<
  typeof ItemUpdateInputReponseSchema
>;

export function fetchItems(
  params?: ItemsQuery,
): Promise<z.infer<typeof ResponseSchema>> {
  let baseUrl = '/items';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.q) {
      searchParams.append('q', params.q);
    }

    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString());
    }

    if (params.skip !== undefined) {
      searchParams.append('skip', params.skip.toString());
    }

    if (params.needsRevision !== undefined) {
      searchParams.append('needsRevision', params.needsRevision.toString());
    }

    if (params.categories?.length) {
      searchParams.append('categories', params.categories.join(','));
    }

    if (params.sortColumn) {
      searchParams.append('sortColumn', params.sortColumn);
    }

    if (params.sortDirection) {
      searchParams.append('sortDirection', params.sortDirection);
    }

    const queryString = searchParams.toString();
    if (queryString) {
      baseUrl = `${baseUrl}?${queryString}`;
    }
  }

  return fetch(baseUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => ResponseSchema.parse(data));
}

export function fetchItemById(id: string): Promise<ItemDetails> {
  return fetch(`/items/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => ItemDetailsSchema.parse(data));
}

export function updateItem(
  id: string,
  data: ItemUpdateInput,
): Promise<ItemUpdateInputResponse> {
  const cleanedData = {
    ...data,
    params: Object.fromEntries(
      Object.entries(data.params ?? {}).flatMap(([key, value]) => {
        if (value === '') return [];
        if (typeof value === 'number' && Number.isNaN(value)) return [];
        return [[key, value]];
      }),
    ),
  };

  const validatedData = ItemUpdateInputSchema.parse(cleanedData);

  return fetch(`/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    })
    .then((data) => ItemUpdateInputReponseSchema.parse(data));
}
