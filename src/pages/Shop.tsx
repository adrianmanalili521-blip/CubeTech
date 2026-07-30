import FilterCard from '../components/FilterCard'
import ProductCards from '../components/ProductsCard'
import NebulaImage from '../assets/nebula.jpeg'
import VaporProImage from '../assets/vapor-pro.jpeg'
import BeatStudioImage from '../assets/beat studio.jpeg'
import ChronoWatchImage from '../assets/chrono smartwatch.png'
import ROGMouseImage from '../assets/ROG mouse.png'
import ROGEarbudsImage from '../assets/ROG-earbuds.jpeg'
import ROGLaptopImage from '../assets/ROG-laptop.jpeg'
import ASUSMonitorImage from '../assets/ASUS-monitor.jpeg'
import AnkeriChargerImage from '../assets/Ankeri-wireless-charger.jpg'
import RedDragonGamepadImage from '../assets/red-dragon-gamepad.jpeg'

export default function Shop() {
  const products = [
    { name: 'Nebula Pro Smartphone', category: 'Smartphone', description: 'Flagship performance with AI camera and 5G.', price: 899, image: NebulaImage },
    { name: 'Vapor Pro Laptop', category: 'Laptop', description: 'Ultra-light powerhouse for creators and professionals.', price: 1299, image: VaporProImage },
    { name: 'Beat Studio Headphones', category: 'Audio', description: 'Immersive sound with active noise cancellation.', price: 249, image: BeatStudioImage },
    { name: 'Chrono Smartwatch', category: 'Watch', description: 'Fitness tracking and elegant design in one.', price: 349, image: ChronoWatchImage },
    { name: 'ROG Gaming Mouse', category: 'Gaming', description: 'Precision tracking built for competitive play.', price: 129, image: ROGMouseImage },
    { name: 'ROG Earbuds', category: 'Audio', description: 'Rich sound and seamless everyday portability.', price: 179, image: ROGEarbudsImage },
    { name: 'ROG Laptop', category: 'Laptop', description: 'High-performance laptop tailored for gaming and work.', price: 1599, image: ROGLaptopImage },
    { name: 'ASUS Monitor', category: 'Display', description: 'Crisp visuals with vibrant color and sharp detail.', price: 399, image: ASUSMonitorImage },
    { name: 'Ankeri Wireless Charger', category: 'Accessory', description: 'Fast wireless charging with a premium finish.', price: 69, image: AnkeriChargerImage },
    { name: 'Red Dragon Gamepad', category: 'Gaming', description: 'Comfortable control for console and PC gaming.', price: 89, image: RedDragonGamepadImage },
  ]

  return (
    <div className="m-5">
      <h2 className="text-2xl font-semibold">All Products</h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <FilterCard />

        <div className="flex-1">
          <div className="flex flex-wrap gap-5">
            {products.map((product) => (
              <ProductCards key={product.name} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
