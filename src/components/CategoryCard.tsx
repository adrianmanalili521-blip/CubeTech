import { Smartphone, Laptop, Headphones, Watch, SlidersHorizontal, Gamepad2} from 'lucide-react';

interface CategoryCardProps {
    title: string
}

export default function CategoryCard( { title } : CategoryCardProps) {
    if (title === 'smartphone') {
        return (
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <Smartphone className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>Smartphone</h2>
            </div>
        ) 
    } else if (title === 'laptop') {
        return (
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <Laptop className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>Laptop</h2>
            </div>
        )
    } else if (title === 'audio') {
        return (
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <Headphones className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>Audio</h2>
            </div>
        )
    } else if (title === 'watch') {
        return(
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <Watch className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>SmartWatch</h2>
            </div>            
        )
    } else if (title === 'accessory') {
        return (
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <SlidersHorizontal className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>Accessories</h2>
            </div>
        )
    } else if (title === 'gaming') {
        return (
            <div className="flex flex-col justify-center items-center bg-mist-250 border-1 border-gray-300 h-50 w-50 rounded-lg gap-2">
                <Gamepad2 className='bg-blue-100 h-10 rounded-xl' size={30}/>
                <h2 className='font-bold'>Gaming</h2>
            </div>
        )
    }
}