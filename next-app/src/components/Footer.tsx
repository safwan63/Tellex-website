"use client";
import {  Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-tellex-dark-green border-t border-tellex-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3
              className="text-tellex-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tellex
            </h3>
            <p className="text-tellex-white/70 mb-4 text-sm sm:text-base max-w-md">
            Where curated intelligence and human care come together to choose the right book for you
            </p>
            <div className="flex space-x-4">
              
              <a href="https://www.instagram.com/tellexofficial/" className="text-tellex-white hover:text-tellex-secondary transition-colors">
                <Instagram size={18} />
              </a>
              
              
            </div>
          </div>

          <div>
            <h4 className="text-tellex-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="/explore" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Explore
                </a>
              </li>
              <li>
                <a href="/about" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-tellex-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact#faqs" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/return-refund-policy" className="text-tellex-white/70 hover:text-tellex-white transition-colors text-sm sm:text-base">
                  Return & Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-tellex-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-tellex-white/60 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Tellex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
