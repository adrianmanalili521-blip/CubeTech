import { useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../contexts/AppContext'

interface ProductCardsProps {
    id: number
    name: string
    category: string
    description: string
    price: number
    qty: number
    image: string
    overview: string
}

export default function ProductCards({ id, name, category, description, price, qty, image, overview }: ProductCardsProps) {
    const { isAuthenticated } = useAuth()
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const handleAdd = () => {
        if (!isAuthenticated) {
            navigate('/auth')
            return
        }

        const message = addToCart({ id, name, category, description, price, qty, image, overview }, 1)
        if (message) {
            alert(message)
            return
        }

        navigate('/cart')
    }

    const isAvailable = qty > 0

    return (
        <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50/70 p-6 aspect-square flex items-center justify-center">
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                        {category}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border ${
                        isAvailable
                            ? 'bg-green-50/95 text-green-700 border-green-200/60'
                            : 'bg-red-50/95 text-red-700 border-red-200/60'
                    }`}>
                        {isAvailable && (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                        )}
                        {isAvailable ? `${qty} Left` : 'Sold Out'}
                    </span>
                </div>
                <img src={image} alt={name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 bg-white">
                <div>
                    <div className="flex items-center justify-between gap-4 text-sm text-gray-500">
                        <span className="font-semibold uppercase tracking-wide text-gray-400">{category}</span>
                        <span className="text-lg font-black text-gray-900">${price.toLocaleString()}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-gray-900 line-clamp-1">{name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">{description}</p>
                </div>

                <button
                    onClick={handleAdd}
                    className="mt-6 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Add to cart
                </button>
            </div>
        </div>
    )
}
