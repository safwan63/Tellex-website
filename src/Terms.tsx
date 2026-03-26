import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Terms() {
  return (
    <main className="min-h-screen bg-tellex-dark-green">
      <Navbar />

      <section className="py-12 sm:py-16 md:py-20 bg-tellex-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-tellex-black mb-6 sm:mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms of Service
            </h1>
            
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Welcome to TELLEX ("we", "us", "our").
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              These Terms of Service ("Terms") govern your access to and use of our website tellexai.netlify.app and any services, content, or products offered through it.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              By accessing or using our Site, you agree to be bound by these Terms.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              If you do not agree, please do not use our Site or services.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. Eligibility
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              By using this Site, you confirm that:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>You are at least 18 years old, or</li>
              <li>You are using the Site under the supervision and consent of a legal guardian.</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              You agree to use the Site only for lawful purposes.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. Our Services
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              TELLEX provides:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Product discovery and content on the front website</li>
              <li>Order placement through integrated services</li>
              <li>Payments and order processing via Shopify and its authorized partners</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We reserve the right to modify, suspend, or discontinue any part of the Site or services at any time without notice.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Orders & Payments
            </h2>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>All payments are processed securely through Shopify Inc.</li>
              <li>We do not store or process your credit/debit card details</li>
              <li>Prices, availability, and product descriptions may change without notice</li>
              <li>We reserve the right to refuse or cancel any order at our discretion</li>
              <li>Any refunds, if applicable, will be handled according to our Refund Policy.</li>
            </ul>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. User Responsibilities
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              You agree that you will not:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Use the Site for illegal or unauthorized purposes</li>
              <li>Attempt to hack, disrupt, or misuse the Site</li>
              <li>Provide false or misleading information</li>
              <li>Violate intellectual property rights</li>
              <li>Upload or transmit malware, spam, or harmful code</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Violation of these rules may result in suspension or termination of access.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              5. Intellectual Property
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              All content on this Site—including text, images, branding, logos, and design—is the property of TELLEX or its licensors.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              You may not copy, reproduce, distribute, or exploit any content without prior written permission.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              6. Third-Party Services & Links
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              Our Site may include links or integrations with third-party services, including Shopify.
            </p>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Third-party websites or services</li>
              <li>Their content, policies, or practices</li>
              <li>Any loss or damage caused by third-party services</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Use of third-party services is at your own risk.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              7. Accuracy of Information
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              We aim to provide accurate information, but:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Content may contain errors or omissions</li>
              <li>Information is provided for general purposes only</li>
              <li>We do not guarantee completeness or accuracy at all times</li>
              <li>We may update or correct information without prior notice.</li>
            </ul>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              8. Disclaimer of Warranties
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              The Site and services are provided "as is" and "as available."
            </p>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              We make no warranties that:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>The Site will be uninterrupted or error-free</li>
              <li>Content will always be accurate or reliable</li>
              <li>Services will meet your expectations</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Use of the Site is at your own risk.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              9. Limitation of Liability
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              To the fullest extent permitted by law, TELLEX shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Issues arising from your use of or inability to use the Site</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Our total liability is limited to the amount paid by you, if any.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              10. Indemnification
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              You agree to indemnify and hold harmless TELLEX and its team from any claims or damages arising from:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>Your use of the Site</li>
              <li>Your breach of these Terms</li>
              <li>Your violation of applicable laws or third-party rights</li>
            </ul>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              11. Termination
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              We may suspend or terminate access to the Site at any time if:
            </p>
            <ul className="list-disc list-inside text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 space-y-2 ml-4">
              <li>You violate these Terms</li>
              <li>We suspect misuse or unlawful activity</li>
            </ul>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              All obligations incurred before termination will survive.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              12. Governing Law
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              These Terms are governed by and construed in accordance with the laws of India.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              13. Changes to These Terms
            </h2>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We reserve the right to update or modify these Terms at any time.
            </p>
            <p className="text-tellex-black/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Your continued use of the Site after changes means you accept the revised Terms.
            </p>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-tellex-black mt-8 sm:mt-12 mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              14. Contact Information
            </h2>
            <p className="text-tellex-black/80 text-lg leading-relaxed mb-4">
              For any questions about these Terms, contact us at:
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
















