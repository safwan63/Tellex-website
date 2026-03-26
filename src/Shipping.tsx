import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Shipping() {
  return (
    <main className="min-h-screen bg-tellex-dark-green">
      <Navbar />

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-tellex-black mb-6 sm:mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shipping Policy
            </h1>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shipping Locations
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We currently ship across India 🇮🇳.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Processing Time
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Orders are processed within 1–3 business days after confirmation.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Mystery book selections are curated carefully, so processing may take a little extra care.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Delivery Time
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Estimated delivery time: 4–7 business days, depending on your location.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Remote areas may take slightly longer.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shipping Charges
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Shipping charges (if any) will be clearly mentioned at checkout.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Free shipping may be available during special offers or promotions.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Order Tracking
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Once your order is shipped, you will receive a tracking ID via WhatsApp, email, or SMS.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              You can track your order using the provided tracking details.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Delays
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Delivery delays may occur due to:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Courier partner issues</li>
              <li>Weather conditions</li>
              <li>Festivals or public holidays</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We always try our best to ensure timely delivery.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Incorrect Address
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Please make sure your shipping address and contact details are correct.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Tellex is not responsible for delays or non-delivery due to incorrect information provided by the customer.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

