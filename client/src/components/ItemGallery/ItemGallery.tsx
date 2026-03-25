import { useMemo, useState } from 'react';
import './ItemGallery.css';

export interface ItemGalleryProps {
  images: string[];
  title: string;
}

export const ItemGallery = ({ images, title }: ItemGalleryProps) => {
  const normalizedImages = useMemo(
    () => images.filter((image) => image.trim().length > 0),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = normalizedImages.length > 0;
  const hasManyImages = normalizedImages.length > 1;

  const activeImage = hasImages ? normalizedImages[activeIndex] : '/cover.png';

  return (
    <div className="item-gallery">
      <div className="item-gallery__main">
        <img
          src={activeImage}
          alt={hasImages ? title : 'Плейсхолдер изображения'}
          className="item-gallery__image"
        />
      </div>

      {hasManyImages && (
        <div className="flex item-gallery__thumbs" role="list">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`btn-reset item-gallery__thumb ${
                index === activeIndex ? 'item-gallery__thumb--active' : ''
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Показать изображение ${index + 1}`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="item-gallery__thumb-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
