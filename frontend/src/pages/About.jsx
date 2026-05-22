export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">About BikeIQ</h1>
      <p className="text-slate-400 mt-4">
        BikeIQ is a complete bike information platform built to help riders make informed
        decisions. Browse detailed specs, compare bikes side-by-side, read community reviews,
        and save your favourites.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {[
          ['10K+','Bike specs indexed'],
          ['25K+','Riders comparing'],
          ['4.8★','Average rating'],
        ].map(([n,l]) => (
          <div key={l} className="glass p-6">
            <div className="text-3xl font-bold text-neon">{n}</div>
            <div className="text-slate-400 text-sm mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
