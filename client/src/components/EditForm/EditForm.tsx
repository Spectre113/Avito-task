import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ItemUpdateInput, ItemUpdateInputSchema } from '../../api/items';
import { generateWithOllama } from '../../api/ai';
import { AiButton } from '../AiButton/AiButton';
import { AiSuggestionModal } from '../AiSuggestionModal/AiSuggestionModal';
import { FormField } from '../FormField/FormField';
import { FormInput } from '../FormInput/FormInput';
import { FormTextarea } from '../FormTextarea/FormTextarea';
import { FormSelect } from '../FormSelect/FormSelect';
import './EditForm.css';

export interface EditFormProps {
  initialValues: ItemUpdateInput;
  isSubmitting?: boolean;
  onSubmit: (values: ItemUpdateInput) => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: 'auto', label: 'Авто' },
  { value: 'real_estate', label: 'Недвижимость' },
  { value: 'electronics', label: 'Электроника' },
] as const;

const transmissionOptions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
] as const;

const realEstateTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'room', label: 'Комната' },
] as const;

const electronicsTypeOptions = [
  { value: 'phone', label: 'Телефон' },
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'misc', label: 'Другое' },
] as const;

const conditionOptions = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/у' },
] as const;

export const EditForm = ({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: EditFormProps) => {
  const [aiMode, setAiMode] = useState<'price' | 'description' | null>(null);
  const [aiText, setAiText] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const aiAbortRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ItemUpdateInput>({
    defaultValues: initialValues,
    resolver: zodResolver(ItemUpdateInputSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const category = watch('category');
  const titleValue = watch('title') ?? '';
  const priceValue = watch('price');
  const descriptionValue = watch('description') ?? '';
  const paramsValue = watch('params');

  const aiContext = useMemo(() => {
    return {
      category,
      title: titleValue,
      price: priceValue,
      description: descriptionValue,
      params: paramsValue,
    };
  }, [category, descriptionValue, paramsValue, priceValue, titleValue]);

  const requestAi = async (mode: 'price' | 'description') => {
    setAiMode(mode);
    setAiText('');
    setAiError(null);
    setAiLoading(true);

    aiAbortRef.current?.abort();
    const controller = new AbortController();
    aiAbortRef.current = controller;

    const prompt =
      mode === 'price'
        ? [
            'Ты помощник продавца на Авито.',
            'Оцени рыночную цену по данным объявления и дай ответ в рублях.',
            'Формат: 2-4 буллета с диапазонами цен и кратким пояснением, без воды.',
            '',
            `Категория: ${aiContext.category}`,
            `Название: ${aiContext.title}`,
            `Текущая цена: ${aiContext.price ?? ''}`,
            `Описание: ${aiContext.description ?? ''}`,
            `Характеристики: ${JSON.stringify(aiContext.params ?? {})}`,
          ].join('\n')
        : [
            'Ты помощник продавца на Авито.',
            'Сгенерируй улучшенное описание объявления (до 500 символов), без выдумывания фактов.',
            'Тон: дружелюбный, конкретный. Структура: 2-4 предложения.',
            '',
            `Категория: ${aiContext.category}`,
            `Название: ${aiContext.title}`,
            `Цена: ${aiContext.price ?? ''}`,
            `Текущее описание: ${aiContext.description ?? ''}`,
            `Характеристики: ${JSON.stringify(aiContext.params ?? {})}`,
          ].join('\n');

    try {
      const result = await generateWithOllama({
        prompt,
        signal: controller.signal,
      });
      setAiText(result.text);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setAiError(
        'Не удалось получить ответ от AI. Проверь, что запущена Ollama.',
      );
    } finally {
      setAiLoading(false);
    }
  };

  const closeAi = () => {
    aiAbortRef.current?.abort();
    setAiLoading(false);
    setAiMode(null);
    setAiText('');
    setAiError(null);
  };

  const applyAi = () => {
    if (!aiMode) return;

    if (aiMode === 'description') {
      setValue('description', aiText, { shouldValidate: true });
      closeAi();
      return;
    }

    // price mode: try to extract first integer-like number
    const match = aiText.replace(/\u00A0/g, ' ').match(/(\d[\d\s]{2,})/);
    if (match) {
      const n = Number(match[1].replace(/\s+/g, ''));
      if (Number.isFinite(n)) {
        setValue('price', n, { shouldValidate: true });
      }
    }
    closeAi();
  };

  return (
    <form
      className="flex edit-form"
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        console.log('[EditForm] invalid submit', formErrors);
      })}
    >
      <div className="edit-form__grid">
        <FormField label="Категория" required error={errors.category?.message}>
          <FormSelect options={categoryOptions} {...register('category')} />
        </FormField>

        <FormField
          label="Название"
          required
          error={errors.title?.message}
          onClear={() => setValue('title', '', { shouldValidate: true })}
        >
          <FormInput placeholder="Введите название" {...register('title')} />
        </FormField>

        <FormField
          label="Цена"
          required
          error={errors.price?.message}
          onClear={() => setValue('price', 0, { shouldValidate: true })}
          actions={
            <AiButton onClick={() => requestAi('price')} disabled={aiLoading}>
              Узнать рыночную цену
            </AiButton>
          }
        >
          <FormInput
            type="number"
            placeholder="Введите цену"
            {...register('price', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <CategoryParamsFields
          category={category}
          register={register}
          setValue={setValue}
          watch={watch}
        />

        <div className="edit-form__description">
          <FormField
            label="Описание"
            error={errors.description?.message}
            onClear={() =>
              setValue('description', '', { shouldValidate: true })
            }
            actions={
              <AiButton
                onClick={() => requestAi('description')}
                disabled={aiLoading}
              >
                {descriptionValue.trim()
                  ? 'Улучшить описание'
                  : 'Придумать описание'}
              </AiButton>
            }
          >
            <FormTextarea
              placeholder="Опишите проблему"
              maxLength={1000}
              currentLength={descriptionValue.length}
              {...register('description')}
            />
          </FormField>
        </div>
      </div>

      <div className="flex edit-form__actions">
        <button
          type="submit"
          className="btn-reset edit-form__button edit-form__button--primary"
          disabled={isSubmitting}
        >
          Сохранить
        </button>

        <button
          type="button"
          className="btn-reset edit-form__button edit-form__button--secondary"
          onClick={onCancel}
        >
          Отменить
        </button>
      </div>

      {aiMode && (
        <AiSuggestionModal
          title={aiMode === 'price' ? 'Ответ AI:' : 'Ответ AI:'}
          text={aiText}
          isLoading={aiLoading}
          error={aiError}
          onApply={applyAi}
          onClose={closeAi}
        />
      )}
    </form>
  );
};

type CategoryParamsFieldsProps = {
  category: ItemUpdateInput['category'];
  register: ReturnType<typeof useForm<ItemUpdateInput>>['register'];
  setValue: ReturnType<typeof useForm<ItemUpdateInput>>['setValue'];
  watch: ReturnType<typeof useForm<ItemUpdateInput>>['watch'];
};

const CategoryParamsFields = ({
  category,
  register,
  setValue,
  watch,
}: CategoryParamsFieldsProps) => {
  if (category === 'auto') {
    const mileageValue = watch('params.mileage');
    const enginePowerValue = watch('params.enginePower');

    return (
      <>
        <h3 className="form__title">Характеристики</h3>

        <FormField
          label="Марка"
          onClear={() =>
            setValue('params.brand', undefined, { shouldValidate: true })
          }
        >
          <FormInput {...register('params.brand')} />
        </FormField>

        <FormField
          label="Модель"
          onClear={() =>
            setValue('params.model', undefined, { shouldValidate: true })
          }
        >
          <FormInput {...register('params.model')} />
        </FormField>

        <FormField
          label="Год выпуска"
          onClear={() =>
            setValue('params.yearOfManufacture', undefined, {
              shouldValidate: true,
            })
          }
        >
          <FormInput
            type="number"
            {...register('params.yearOfManufacture', {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField label="Коробка передач">
          <FormSelect
            options={transmissionOptions}
            placeholder="Выберите"
            {...register('params.transmission', {
              setValueAs: (value) => (value === '' ? undefined : value),
            })}
          />
        </FormField>

        <FormField
          characteristic
          label="Пробег"
          warning={mileageValue === undefined}
          onClear={() =>
            setValue('params.mileage', undefined, { shouldValidate: true })
          }
        >
          <FormInput
            type="number"
            {...register('params.mileage', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          characteristic
          label="Мощность двигателя"
          warning={enginePowerValue === undefined}
          onClear={() =>
            setValue('params.enginePower', undefined, {
              shouldValidate: true,
            })
          }
        >
          <FormInput
            type="number"
            {...register('params.enginePower', { valueAsNumber: true })}
          />
        </FormField>
      </>
    );
  }

  if (category === 'real_estate') {
    const typeValue = watch('params.type');
    const areaValue = watch('params.area');
    const floorValue = watch('params.floor');

    return (
      <>
        <h3 className="form__title">Характеристики</h3>

        <FormField label="Тип недвижимости" warning={typeValue === undefined}>
          <FormSelect
            options={realEstateTypeOptions}
            placeholder="Выберите"
            {...register('params.type', {
              setValueAs: (value) => (value === '' ? undefined : value),
            })}
          />
        </FormField>

        <FormField
          label="Адрес"
          onClear={() =>
            setValue('params.address', undefined, { shouldValidate: true })
          }
        >
          <FormInput {...register('params.address')} />
        </FormField>

        <FormField
          characteristic
          label="Площадь"
          warning={areaValue === undefined}
          onClear={() =>
            setValue('params.area', undefined, { shouldValidate: true })
          }
        >
          <FormInput
            type="number"
            {...register('params.area', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          characteristic
          label="Этаж"
          warning={floorValue === undefined}
          onClear={() =>
            setValue('params.floor', undefined, { shouldValidate: true })
          }
        >
          <FormInput
            type="number"
            {...register('params.floor', { valueAsNumber: true })}
          />
        </FormField>
      </>
    );
  }

  const colorValue = watch('params.color') ?? '';
  const conditionValue = watch('params.condition');

  return (
    <>
      <h3 className="form__title">Характеристики</h3>

      <FormField label="Тип">
        <FormSelect
          options={electronicsTypeOptions}
          placeholder="Выберите"
          {...register('params.type', {
            setValueAs: (value) => (value === '' ? undefined : value),
          })}
        />
      </FormField>

      <FormField
        label="Бренд"
        onClear={() =>
          setValue('params.brand', undefined, { shouldValidate: true })
        }
      >
        <FormInput {...register('params.brand')} />
      </FormField>

      <FormField
        label="Модель"
        onClear={() =>
          setValue('params.model', undefined, { shouldValidate: true })
        }
      >
        <FormInput {...register('params.model')} />
      </FormField>

      <FormField
        characteristic
        label="Цвет"
        warning={!colorValue.trim()}
        onClear={() =>
          setValue('params.color', undefined, { shouldValidate: true })
        }
      >
        <FormInput {...register('params.color')} />
      </FormField>

      <FormField
        label="Состояние"
        characteristic
        warning={conditionValue === undefined}
      >
        <FormSelect
          options={conditionOptions}
          placeholder="Выберите"
          {...register('params.condition', {
            setValueAs: (value) => (value === '' ? undefined : value),
          })}
        />
      </FormField>
    </>
  );
};
