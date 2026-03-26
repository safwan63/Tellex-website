"use client";

export default function ImageMarquee() {
  const images = [
    '/book1.webp',
    '/book2.webp',
    '/book3.webp',
    '/book4.webp',
    '/book5.webp',
    '/book6.webp',
    '/book7.webp'
  ];
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
