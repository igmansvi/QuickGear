import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const contactStatus = "";
  const statusClass = "";
  const isLoggedIn = false;
  const userName = "";
  const userEmail = "";

  return (
    <>
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-1">
                Quick Gear
              </h3>
              <div className="flex items-center mb-3">
                <i className="fas fa-tools text-2xl text-accent mr-2"></i>
                <span className="text-lg font-bold">Tool Rental</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Providing quality tools and equipment for every project with
                competitive pricing and reliable service.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-1">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    id="footer-home"
                    to="/"
                    className="text-gray-300 hover:text-accent transition-all flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-primary mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    id="footer-browse"
                    to="/browse"
                    className="text-gray-300 hover:text-accent transition-all flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-primary mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    Browse Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    id="footer-bookings"
                    to="/bookings"
                    className="text-gray-300 hover:text-accent transition-all flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-primary mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    My Bookings
                  </Link>
                </li>
                <li>
                  <a
                    id="footer-how-it-works"
                    href="/#how-it-works"
                    className="text-gray-300 hover:text-accent transition-all flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-primary mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    id="footer-faqs"
                    href="/#faqs"
                    className="text-gray-300 hover:text-accent transition-all flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-primary mr-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-1">
                Contact Us
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-primary mr-2 mt-1"></i>
                  <span className="text-gray-300">
                    123 Tool Street, Equipment City, EC 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt text-primary mr-2"></i>
                  <span className="text-gray-300">+91 9087654321</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-primary mr-2"></i>
                  <span className="text-gray-300">info@quickgear.com</span>
                </li>
              </ul>
              <div className="mt-4">
                <form method="post" id="footer-contact-form">
                  {contactStatus && (
                    <div className={`mb-2 ${statusClass} text-xs`}>
                      {contactStatus}
                    </div>
                  )}

                  {isLoggedIn && userName ? (
                    <input
                      type="hidden"
                      name="footer_name"
                      value={userName}
                      className="bg-white"
                    />
                  ) : (
                    <input
                      type="text"
                      name="footer_name"
                      placeholder="Your name"
                      className="w-full p-2 mb-2 text-xs rounded-lg text-gray-900 bg-white"
                    />
                  )}

                  {isLoggedIn && userEmail ? (
                    <input
                      type="hidden"
                      name="footer_email"
                      value={userEmail}
                      className="bg-white"
                    />
                  ) : (
                    <input
                      type="email"
                      name="footer_email"
                      placeholder="Your email"
                      className="w-full p-2 mb-2 text-xs rounded-lg text-gray-900 bg-white"
                    />
                  )}

                  <textarea
                    name="footer_message"
                    placeholder="Your message"
                    className="w-full p-2 text-xs rounded-lg text-gray-900 min-h-[60px] resize-none bg-white"
                  />
                  <button
                    type="submit"
                    name="footer_contact_submit"
                    className="w-full mt-2 bg-primary text-gray-900 text-xs p-2 rounded-lg hover:bg-secondary transition-all flex items-center justify-center"
                  >
                    <i className="fas fa-paper-plane mr-1"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-1">
                Follow Us
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-2">
                <a
                  href="#"
                  className="bg-blue-800 hover:bg-blue-700 p-3 rounded-lg text-center transition-all duration-300"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a
                  href="#"
                  className="bg-sky-500 hover:bg-sky-400 p-3 rounded-lg text-center transition-all duration-300"
                  title="Twitter"
                >
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a
                  href="#"
                  className="bg-pink-600 hover:bg-pink-500 p-3 rounded-lg text-center transition-all duration-300"
                  title="Instagram"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a
                  href="#"
                  className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-center transition-all duration-300"
                  title="LinkedIn"
                >
                  <i className="fab fa-linkedin-in text-lg"></i>
                </a>
              </div>
              <p className="text-gray-300 text-xs">Stay connected</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs">
              <p className="text-gray-400">
                © 2023 Quick Gear. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
