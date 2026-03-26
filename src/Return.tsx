import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Return() {
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
              Return & Refund Policy
            </h1>

            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We have a 5-day return policy, which means you have 5 days after receiving your item to request a return.
            </p>

            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>

            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
              To start a return, you can contact us at <a href="mailto:tellexaiofficial@gmail.com" className="text-tellex-dark-green hover:underline">tellexaiofficial@gmail.com</a>. Please note that returns will need to be sent to the following address: parambil palli Makkam, Kiralur, Near kiralur A.U.P school Kozhikode, Kerala, 673611
            </p>

            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>

            <p className="text-tellex-black/80 text-lg leading-relaxed mb-8">
              You can always contact us for any return question at <a href="mailto:tellexaiofficial@gmail.com" className="text-tellex-dark-green hover:underline">tellexaiofficial@gmail.com</a>.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Damages and issues
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Exceptions / non-returnable items
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Exchanges
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Refunds
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
              We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
              If more than 15 business days have passed since we've approved your return, please contact us at:
            </p>
            <div className="bg-tellex-white p-6 rounded-2xl shadow-lg mb-6">
              <p className="text-tellex-black/80 text-lg font-semibold mb-3">TELLEX</p>
              <p className="text-tellex-black/80 text-lg mb-2">
                📧 Email: <a href="mailto:tellexaiofficial@gmail.com" className="text-tellex-dark-green hover:underline">tellexaiofficial@gmail.com</a>
              </p>
              <p className="text-tellex-black/80 text-lg mb-2">
                📍 Address: BAITHUL ZAKWAN, KIRALUR KIZHAKKUMMURI POST,<br />
                KAKKODI, KOZHIKODE, KERALA, INDIA – 673611
              </p>
              <p className="text-tellex-black/80 text-lg">
                📞 Phone: 8590543842 / 9744643347 / +91 7907717006
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}















