import { z } from 'zod';

export const CategorySchema = z.enum(['auto', 'real_estate', 'electronics']);
export type Category = z.infer<typeof CategorySchema>;

export const ItemSchema = z.object({
  id: z.number().int().positive(),
  category: CategorySchema,
  title: z.string().min(1),
  price: z.number().nonnegative(),
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
  sortColumn: z.enum(['title', 'createdAt']).optional(),
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

export const ItemDetailsSchema = z.object({
  id: z.number().int().positive(),
  category: CategorySchema,
  title: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
  params: ItemParamsSchema,
  needsRevision: z.boolean(),
});

export type ItemDetails = z.infer<typeof ItemDetailsSchema>;

export const ItemUpdateInputSchema = z.object({
  category: CategorySchema,
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  params: ItemParamsSchema,
});

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
  let baseUrl = 'http://localhost:8081/items';
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
  return fetch(`http://localhost:8081/items/${id}`)
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
  return fetch(`http://localhost:8081/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    })
    .then((data) => ItemUpdateInputReponseSchema.parse(data));
}
