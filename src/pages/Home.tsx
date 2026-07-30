import BgImage from '../assets/bg.jpeg'
import CategoryCard from '../components/CategoryCard'

export default function Home() {
  return (
    <div>
      <div className="w-full min-h-screen bg-slate-50">
        {/* 1. Hero Block (Image + Absolute Text and Buttons) */}
        <section className="relative w-full h-[450px] overflow-hidden bg-slate-900">
          
          {/* Background Image Layer */}
          <img 
            src={BgImage} 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Text and Button Overlay Layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h1 className="text-4xl font-bold mb-4">
              Your Beautiful Heading
            </h1>
            <p className="text-lg text-slate-200 max-w-md mb-6">
              Describe your product or feature here. This text floats completely on top of the image layout safely.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition">
                Primary Action
              </button>
              <button className="bg-white/25 hover:bg-white/35 backdrop-blur-sm text-white font-medium py-2.5 px-6 rounded-xl transition">
                Secondary Button
              </button>
            </div>
          </div>

        </section>


        <div className='p-4 m-5 flex-col w-full'>
          <h2 className='font-bold mb-5'>Browse by Category</h2>
          <div className='flex flex-row gap-5' >
            <CategoryCard title='smartphone'/>
            <CategoryCard title='laptop' />
            <CategoryCard title='audio' />
            <CategoryCard title='watch' />
            <CategoryCard title='accessory' />
            <CategoryCard title='gaming' />

          </div>
        </div>
      </div>
    </div>
  )
}
