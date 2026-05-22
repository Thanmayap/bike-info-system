import { Bike, Mail, Phone, MapPin } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg"><Bike className="text-neon"/> BikeIQ</div>
          <p className="text-sm text-slate-400 mt-2">The smart way to research, compare and choose your next bike.</p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-semibold text-white">Contact</h4>
          <div className="flex items-center gap-2 text-slate-400"><Mail size={14}/> support@bikeiq.app</div>
          <div className="flex items-center gap-2 text-slate-400"><Phone size={14}/> +91 98765 43210</div>
          <div className="flex items-center gap-2 text-slate-400"><MapPin size={14}/> Bengaluru, India</div>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-white mb-2">Newsletter</h4>
          <form className="flex gap-2" onSubmit={(e)=>e.preventDefault()}>
            <input className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg" placeholder="Email"/>
            <button className="btn btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 py-4 border-t border-white/5">© {new Date().getFullYear()} BikeIQ. All rights reserved.</div>
    </footer>
  );
}
