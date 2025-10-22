import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 to-black text-white pt-10 pb-6 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Full Footer for md and above */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">T</div>
              <h2 className="text-2xl font-black text-white">Treazr</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to the world's most coveted collectibles, curated with passion.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Categories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Top Rated</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Follow</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Small screen footer */}
        <div className="md:hidden flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">T</div>
            <h2 className="text-xl font-black text-white">Treazr</h2>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Categories</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Treazr. All rights reserved.</p>
            <div className="flex gap-4 mt-3 sm:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
