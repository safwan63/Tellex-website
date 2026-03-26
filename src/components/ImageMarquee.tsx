import book1 from './Image/book1.webp';
import book2 from './Image/book2.webp';
import book3 from './Image/book3.webp';
import book4 from './Image/book4.webp';
import book5 from './Image/book5.webp';
import book6 from './Image/book6.webp';
import book7 from './Image/book7.webp';


export default function ImageMarquee() {
  const images = [book1, book2, book3, book4, book5, book6, book7 ];
  const duplicatedImages = [...images, ...images];

  return (
    <section className="carousel-section">
      

      <div className="carousel-container">
        {duplicatedImages.map((img, index) => (
          <div key={index} className="carousel-card">
            <div className="image-frame">
              <img src={img} alt={`Book ${index + 1}`}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
               />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
