import './EditPage.css';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ZodError } from 'zod';
import { fetchItemById, updateItem } from '../../api/items';
import { Spinner } from '../../components/Spinner/Spinner';
import { EditForm } from '../../components/EditForm/EditForm';
import { mapItemToFormValues } from './mapItemToFormValues';
import type { ItemUpdateInput } from '../../api/items';

export const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const initialValues = useMemo(() => {
    if (!data) {
      return null;
    }

    return mapItemToFormValues(data);
  }, [data]);

  const handleCancel = () => {
    if (!id) return;
    navigate(`/ads/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex edit-loader">
        <Spinner />
      </div>
    );
  }

  if (error || !data || !initialValues || !id) {
    return <span>Ошибка загрузки данных</span>;
  }

  const onSubmit = async (values: ItemUpdateInput) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const updatedItem = await updateItem(id, values);

      await queryClient.invalidateQueries({
        queryKey: ['item', id],
      });

      await queryClient.invalidateQueries({
        queryKey: ['items'],
      });

      navigate(`/ads/${id}`);
    } catch (error) {
      if (error instanceof ZodError) {
        setSubmitError('Форма заполнена некорректно');
        return;
      }

      setSubmitError('Не удалось сохранить изменения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="edit-page">
      <div className="container">
        <header className="edit-page__header">
          <h1 className="edit-page__title">Редактирование объявления</h1>
        </header>

        {submitError && <div className="edit-page__error">{submitError}</div>}

        <section className="edit-page__content">
          <EditForm
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={handleCancel}
          />
        </section>
      </div>
    </main>
  );
};
