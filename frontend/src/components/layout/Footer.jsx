import { Mail, Phone } from 'lucide-react'
import WowLogo from '../ui/WowLogo'

export default function Footer() {
  return (
    <footer id="about" className="bg-brand-dark border-t border-brand-border mt-16">
      {/* Red top accent stripe */}
      <div className="h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <WowLogo size="lg" className="rounded-xl shadow-md" />
              <div>
                <p className="font-black text-xl text-white leading-none">WOW</p>
                <p className="font-black text-xl text-primary-500 leading-none">BURGER</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A local fast-food restaurant chain in Addis Ababa serving burgers,
              fries, chicken wraps, pizza, and other casual American-style fast food.
              Multiple branches across the city.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-primary-400">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:wowburgeret@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  <Mail size={14} className="text-primary-500 flex-shrink-0" aria-hidden="true" />
                  wowburgeret@gmail.com
                </a>
              </li>
              {['+251911634938', '+251911875524', '+251990222919'].map(p => (
                <li key={p}>
                  <a href={`tel:${p}`}
                    className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    <Phone size={14} className="text-primary-500 flex-shrink-0" aria-hidden="true" />
                    {p.replace(/(\+251)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-primary-400">
              Follow Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.tiktok.com/@wowburgeret" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-brand-muted group-hover:bg-primary-500 flex items-center justify-center text-xs font-black transition-colors">TK</span>
                  TikTok
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-gray-600 cursor-not-allowed">
                  <span className="w-8 h-8 rounded-lg bg-brand-border flex items-center justify-center text-xs font-black">FB</span>
                  Facebook
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-gray-600 cursor-not-allowed">
                  <span className="w-8 h-8 rounded-lg bg-brand-border flex items-center justify-center text-xs font-black">TG</span>
                  Telegram
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 WOW Burger. All rights reserved.</p>
          <p className="text-xs text-gray-600">
            Developed by{' '}
            <a href="https://tricore.onrender.com/" target="_blank" rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 hover:underline transition-colors">
              TriCore IT Solution
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
