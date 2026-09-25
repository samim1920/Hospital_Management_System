import React from "react";

function Footer() {
  return (
    <footer className="bg-cyan-950 text-white">

      <div className="px-8 py-8">

        <div className="max-w-7xl mx-auto">

          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Hospital Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">

                <div className="text-4xl">
                  🏥
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    HOSPITAL MANAGEMENT
                  </h2>

                  <p className="text-sm text-cyan-300">
                    Management & Information System
                  </p>
                </div>

              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                A modern hospital management system designed to
                efficiently manage patients, doctors, appointments,
                departments and hospital operations.
              </p>
            </div>


            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Quick Links
              </h3>

              <div className="space-y-2 text-sm">

                <a
                  href="/dashboard"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Dashboard
                </a>

                <a
                  href="/patients"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Patients
                </a>

                <a
                  href="/doctors"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Doctors
                </a>

                <a
                  href="/appointments"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Appointments
                </a>

              </div>
            </div>


            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>

              <div className="space-y-3 text-sm text-gray-300">

                <p>
                  📍 Hospital Administration Office
                </p>

                <p>
                  📞 +91 XXXXX XXXXX
                </p>

                <p>
                  ✉️ admin@hospital.com
                </p>

                <p>
                  🕐 24/7 Hospital Support
                </p>

              </div>
            </div>

          </div>


          {/* Divider */}
          <div className="border-t border-cyan-800 mt-8 pt-5">

            <div className="flex flex-col md:flex-row
              justify-between items-center gap-3">

              <p className="text-sm text-gray-300">
                © 2026 Hospital Management System.
                All rights reserved.
              </p>

              <div className="flex gap-5 text-sm">

                <a
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="text-gray-300 hover:text-white transition"
                >
                  Terms & Conditions
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;