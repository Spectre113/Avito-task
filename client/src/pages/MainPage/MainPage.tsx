import './MainPage.css';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import {
  ViewToggle,
  type ViewMode,
} from '../../components/ViewToggle/ViewToggle';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import {
  SortSelect,
  type SortValue,
} from '../../components/SortSelect/SortSelect';
import { RevisionSwitch } from '../../components/RevisionSwitch/RevisionSwitch';
import { ItemsGrid } from '../../components/ItemsListTypes/ItemsGrid/ItemsGrid';
import { ItemsList } from '../../components/ItemsListTypes/ItemsList/ItemsList';
import { Pagination } from '../../components/Pagination/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchItems, type Category } from '../../api/items';
import { Spinner } from '../../components/Spinner/Spinner';

const ITEMS_PER_PAGE_MAP = {
  grid: 10,
  list: 4,
} as const;

type SortQuery = {
  sortColumn: 'createdAt' | 'title' | 'price';
  sortDirection: 'asc' | 'desc';
};

const mapSortToQuery = (sort: SortValue): SortQuery => {
  switch (sort) {
    case 'createdAt_desc':
      return {
        sortColumn: 'createdAt',
        sortDirection: 'desc',
      };

    case 'createdAt_asc':
      return {
        sortColumn: 'createdAt',
        sortDirection: 'asc',
      };

    case 'title_asc':
      return {
        sortColumn: 'title',
        sortDirection: 'asc',
      };

    case 'title_desc':
      return {
        sortColumn: 'title',
        sortDirection: 'desc',
      };

    case 'price_asc':
      return {
        sortColumn: 'price',
        sortDirection: 'asc',
      };

    case 'price_desc':
      return {
        sortColumn: 'price',
        sortDirection: 'desc',
      };

    default:
      return {
        sortColumn: 'createdAt',
        sortDirection: 'desc',
      };
  }
};
export const MainPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<SortValue>('createdAt_desc');
  const [needsRevisionOnly, setNeedsRevisionOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);
  const itemsPerPage = ITEMS_PER_PAGE_MAP[viewMode];

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categories, sort, needsRevisionOnly, viewMode]);

  const buildQueryKey = (page: number) => [
    'mainPageData',
    debouncedSearch,
    categories,
    sort,
    needsRevisionOnly,
    viewMode,
    itemsPerPage,
    page,
  ];

  const buildQueryParams = (page: number) => ({
    q: debouncedSearch || undefined,
    categories: categories.length ? categories : undefined,
    needsRevision: needsRevisionOnly || undefined,
    limit: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
    ...mapSortToQuery(sort),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: buildQueryKey(currentPage),
    queryFn: () => fetchItems(buildQueryParams(currentPage)),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.total / itemsPerPage) : 0;
  }, [data, itemsPerPage]);

  useEffect(() => {
    if (!data) return;

    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;

    if (nextPage <= totalPages) {
      queryClient.prefetchQuery({
        queryKey: buildQueryKey(nextPage),
        queryFn: () => fetchItems(buildQueryParams(nextPage)),
        staleTime: 30_000,
      });
    }

    if (prevPage >= 1) {
      queryClient.prefetchQuery({
        queryKey: buildQueryKey(prevPage),
        queryFn: () => fetchItems(buildQueryParams(prevPage)),
        staleTime: 30_000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    currentPage,
    totalPages,
    queryClient,
    debouncedSearch,
    categories,
    sort,
    needsRevisionOnly,
    viewMode,
    itemsPerPage,
  ]);

  const handleClick = (id: number) => {
    navigate(`/ads/${id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategories([]);
    setNeedsRevisionOnly(false);
    setSort('createdAt_desc');
    setCurrentPage(1);
  };

  if (error) {
    return <span>Ошибка загрузки данных</span>;
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="header__title">Мои объявления</h1>
          <span className="header__ad-number">
            {data?.total ?? 0} объявления
          </span>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="flex toolbar">
            <div className="toolbar__search-block">
              <SearchInput
                placeholder="Найти объявление..."
                value={search}
                onChange={setSearch}
              />
            </div>

            <div className="toolbar__toggle-block">
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>

            <div className="flex toolbar__filter-block">
              <SortSelect value={sort} onChange={setSort} />
            </div>
          </section>

          <section className="flex layout">
            <aside className="filters">
              <div className="filters__toolbar">
                <h2 className="filters__title">Фильтры</h2>

                <CategoryFilter value={categories} onChange={setCategories} />

                <div className="filters__revision-block">
                  <RevisionSwitch
                    checked={needsRevisionOnly}
                    onChange={setNeedsRevisionOnly}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-reset flex filters__reset-button"
                onClick={handleResetFilters}
              >
                Сбросить фильтры
              </button>
            </aside>

            <div className="items">
              {isLoading ? (
                <div className="spinner-content">
                  <Spinner />
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <ItemsGrid
                      items={data?.items ?? []}
                      onCardClick={handleClick}
                    />
                  ) : (
                    <ItemsList
                      items={data?.items ?? []}
                      onCardClick={handleClick}
                    />
                  )}

                  {totalPages > 1 && (
                    <div className="items__pagination">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
