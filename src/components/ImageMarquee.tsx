import IM1 from './Image/IM1.webp';
import IM2 from './Image/IM2.webp';
import IM3 from './Image/IM3.webp';
import IM4 from './Image/IM4.webp';
import IM5 from './Image/IM5.webp';
import IM6 from './Image/IM6.webp';

export default function ImageMarquee() {
  const images = [IM1, IM2, IM3, IM4, IM5, IM6];
  const duplicatedImages = [...images, ...images];

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        {duplicatedImages.map((img, index) => (
          <div key={index} className="carousel-card relative overflow-hidden group">
            <div className="image-frame w-full h-full">
              <img 
                src={img} 
                alt={`Book ${index + 1}`}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
               />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
