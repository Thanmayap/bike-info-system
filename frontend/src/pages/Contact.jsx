import toast from 'react-hot-toast';
export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Contact us</h1>
      <p className="text-slate-400 mt-2">We typically respond within 24 hours.</p>
      <form onSubmit={(e)=>{e.preventDefault(); toast.success('Message sent!');}} className="glass p-6 mt-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="px-3 py-2 bg-white/5 rounded-lg border border-white/10" placeholder="Name" required/>
          <input type="email" className="px-3 py-2 bg-white/5 rounded-lg border border-white/10" placeholder="Email" required/>
        </div>
        <textarea rows="5" className="w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10" placeholder="Message" required/>
        <button className="btn btn-primary">Send message</button>
      </form>
    </div>
  );
}
