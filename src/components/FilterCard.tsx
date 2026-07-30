import { Search } from 'lucide-react';

export default function FilterCard() {
    const categories = [
        { id: 'smartphone', label: 'Smartphones' },
        { id: 'laptop', label: 'Laptops' },
        { id: 'audio', label: 'Audio' },
        { id: 'wearable', label: 'Wearables' },
        { id: 'accessories', label: 'Accessories' },
        { id: 'gaming', label: 'Gaming' }
    ];

    return (
        <div className='flex flex-col justify-start h-fit w-80 bg-white shadow rounded-sm p-4 gap-4'>
            <div>
                <p className='font-bold text-xs text-gray-500 tracking-wider mb-2'>SEARCH</p>
                <div className="relative text-slate-400 w-full">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5" />
                    </div>
                    <input 
                        placeholder="Search..." 
                        className="w-full h-9 bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 border border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div>
                <p className='font-bold text-xs text-gray-500 tracking-wider mb-2'>CATEGORY</p>
                {/* 1. Flex layout wrapper with vertical spacing */}
                <div className='flex flex-col gap-2.5'>
                    {categories.map((cat) => (
                        // 2. Wrap pair in flex row to force button to left, text to right
                        <label key={cat.id} htmlFor={cat.id} className='flex items-center gap-3 cursor-pointer text-sm text-slate-700 select-none'>
                            <input 
                                id={cat.id}
                                type='radio'
                                name='Categories'
                                // 3. Custom square styling overriding native circular layout
                                className='w-4 h-4 rounded-none border border-gray-300 text-blue-600 focus:ring-0 appearance-none checked:bg-blue-500 checked:border-blue-500 relative checked:after:content-["✓"] checked:after:text-white checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center'
                            />
                            <span>{cat.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
