import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../tempData/products";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));

  // State to manage user selected quantity
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return (
      <div className="p-10 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The item you are looking for does not exist.</p>
        <Link to="/shop" className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
          &larr; Back to Shop
        </Link>
      </div>
    );
  }

  // Cap the user interaction capability at remaining item availability 
  const maxLimit = product.qty;

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev < maxLimit ? prev + 1 : prev));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1">
          &larr; Back to Shop
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Layout Side: Image Canvas Container */}
        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-200/60 shadow-sm aspect-square md:max-h-[500px]">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transform hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Right Layout Side: Meta Details & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category Tag & Stock Status Indicators */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase font-semibold tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                {product.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                product.qty > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {product.qty > 0 ? `In Stock (${product.qty} left)` : "Out of Stock"}
              </span>
            </div>

            {/* Title & Pricing */}
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-4 sm:text-4xl">{product.name}</h1>
            <p className="text-3xl font-bold text-gray-900 mt-3">${product.price.toLocaleString()}</p>

            {/* Brief Catchphrase Tagline */}
            <p className="text-lg text-gray-600 font-medium italic mt-6 border-l-4 border-gray-300 pl-4">
              "{product.description}"
            </p>

            {/* Long-form Structural Product Story Overview */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Overview</h3>
              <p className="text-base text-gray-600 mt-3 leading-relaxed whitespace-pre-line">
                {product.overview}
              </p>
            </div>
          </div>

          {/* Action Segment Box */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            {product.qty > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Custom Stepper Button Block */}
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Quantity
                  </span>
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm h-[46px]">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-10 h-full flex items-center justify-center font-bold text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="flex-1 text-center text-sm font-semibold text-gray-800 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={quantity >= maxLimit}
                      className="w-10 h-full flex items-center justify-center font-bold text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors"
                    >
                      &#43;
                    </button>
                  </div>
                </div>

                {/* Main Interactive Checkout Button */}
                <div className="flex-1 flex flex-col gap-1.5 justify-end">
                  <span className="hidden sm:block text-xs font-bold text-transparent select-none uppercase">Action</span>
                  <button onClick={() => alert(`Added ${quantity} x ${product.name} to cart!`)} className="w-full h-[46px] bg-black text-white px-8 rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-sm active:scale-[0.99]" >
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-400 py-3 px-8 rounded-lg text-sm font-medium cursor-not-allowed text-center" >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
