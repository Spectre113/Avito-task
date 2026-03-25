import type { Item } from '../../api/items';

export interface ItemsListProps {
  items: Item[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onCardClick?: (id: number) => void;
  isLoading?: boolean;
  imageUrl?: string;
}
