import './ItemPage.css';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchItemById } from '../../api/items';
import { Spinner } from '../../components/Spinner/Spinner';
import { ItemHeader } from '../../components/ItemHeader/ItemHeader';
import { ItemRevisionNotice } from '../../components/ItemRevisionNotice/ItemRevisionNotice';
import { ItemCharacteristics } from '../../components/ItemCharacteristics/ItemCharacteristics';
import { ItemDescription } from '../../components/ItemDescription/ItemDescription';

import { getMissingFields } from './getMissingFields';
import { getCharacteristics } from './getCharacteristics';
import { ItemGallery } from '../../components/ItemGallery/ItemGallery';

export const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Item id is missing');
      }

      return fetchItemById(id);
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex item-loader">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return <span>Ошибка загрузки данных</span>;
  }

  const missingFields = getMissingFields(data);
  const characteristics = getCharacteristics(data);

  return (
    <>
      <header className="item-page__header">
        <div className="container">
          <ItemHeader
            title={data.title}
            price={data.price}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
            onEditClick={() => navigate(`/ads/${data.id}/edit`)}
          />
        </div>
      </header>
      <main className="item-page">
        <div className="container">
          <section className="flex item-page__main">
            <ItemGallery images={[]} title={data.title} />
            <div className="flex item-page__info">
              <ItemRevisionNotice fields={missingFields} />
              <ItemCharacteristics items={characteristics} />
            </div>
          </section>

          <section className="item-page__description">
            <ItemDescription description={data.description} />
          </section>
        </div>
      </main>
    </>
  );
};
