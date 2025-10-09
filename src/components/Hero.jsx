import BubbleField from './BubbleField.jsx'
import TypeWriter from './TypeWriter.jsx'
import myPhoto from '../assets/myphoto.png'

export default function Hero() {
  return (
    <section id="home" className="relative pt-16">
      {/* White stage background and parallax bubbles */}
      <div className="relative bg-white text-slate-900">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <BubbleField count={16} color="#06b6d4" />

          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="order-2 lg:order-1">
              <p className="text-sm uppercase tracking-widest text-slate-500">Designer • Developer</p>
              <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight">
                <TypeWriter text="Hello, I’m Chalanka Kodikara" />
              </h1>
              <p className="mt-4 text-slate-600 max-w-xl">
                Software Engineer & Designer passionate about scalable software solutions, strong problem‑solving and communication, and building elegant UIs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#projects" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition">View Projects</a>
                <a href="#contact" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition">Contact Me</a>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-2xl  ring-black/5 bg-white">
                <img src={myPhoto} alt="Chalanka Kodikara" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White bio card overlapping bottom */}
      
    </section>
  )
}



