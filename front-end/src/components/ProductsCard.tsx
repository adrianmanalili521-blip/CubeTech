interface ProductCardsProps {
    id: number
    name: string
    category: string
    description: string
    price: number
    image: string
}

export default function ProductCards({id, name, category, description, price, image }: ProductCardsProps) {
    return (
        <div className="w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <img src={image} alt={name} className="mb-4 h-44 w-full rounded-xl object-cover" />
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                    {category}
                </span>
                <span className="text-sm font-semibold text-slate-900">${price}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{name}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
            <button className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                Add to cart
            </button>
        </div>
    )
}