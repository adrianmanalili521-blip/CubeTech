import FilterCard from '../components/FilterCard' 
import ProductsCard from '../components/ProductsCard' // Renamed to singular for clarity
import products from '../tempData/products' 
import { Link } from "react-router-dom";

// Capitalized type name
export type Product = { 
  id: number; 
  name: string; 
  category: string; 
  description: string; 
  price: number; 
  qty: number;
  image: string;
  overview: string; 
};

export default function Shop() {
  return (
    <div className="m-5">
      <h2 className="text-2xl font-semibold">All Products</h2>
      
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <FilterCard />
        
        <div className="flex-1">
          <div className="flex flex-wrap gap-5">
            {/* Typed the map parameter for better safety */}
            {products.map((product: Product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <ProductsCard {...product} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
