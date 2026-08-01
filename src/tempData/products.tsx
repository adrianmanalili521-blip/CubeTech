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

const products = [
    { 
        id: 1, 
        name: 'Nebula Pro Smartphone', 
        category: 'Smartphone', 
        description: 'Flagship performance with AI camera and 5G.', 
        price: 899, 
        qty: 23, 
        image: NebulaImage,
        overview: 'The Nebula Pro Smartphone redefines mobile technology with its cutting-edge neural processing unit and blazing-fast 5G connectivity. Built for power users and mobile photographers alike, it features a triple-lens system enhanced by real-time AI scene optimization, ensuring pristine low-light captures and stunning clarity. The dynamic AMOLED display offers a buttery-smooth 120Hz refresh rate, while the high-capacity battery keeps you powered through intensive gaming, streaming, and multitasking sessions with ease.'
    },
    { 
        id: 2, 
        name: 'Vapor Pro Laptop', 
        category: 'Laptop', 
        description: 'Ultra-light powerhouse for creators and professionals.', 
        price: 1299, 
        qty: 11, 
        image: VaporProImage,
        overview: 'Engineered for ultimate productivity on the move, the Vapor Pro Laptop combines an elegant, lightweight aerospace-grade aluminum chassis with raw computing power. It boasts the latest multi-core processor and advanced thermal management to handle demanding tasks like 4K video editing, compiling code, and resource-heavy multi-tasking without stuttering. The color-accurate panel ensures that visual artists see true-to-life tones, and its long battery runtime frees you from the wall outlet.'
    },
    { 
        id: 3, 
        name: 'Beat Studio Headphones', 
        category: 'Audio', 
        description: 'Immersive sound with active noise cancellation.', 
        price: 249, 
        qty: 40, 
        image: BeatStudioImage,
        overview: 'Escape into your own world with the Beat Studio Headphones, featuring elite-tier hybrid Active Noise Cancellation that continuously maps your environment to block outside distractions. Custom-engineered dynamic drivers deliver a wide frequency range with rich, deep bass and crystal-clear highs. Designed with plush memory-foam ear cushions and an adjustable headband, they provide pressure-free comfort for all-day listening sessions, supplemented by rapid fast-charging capabilities.'
    },
    { 
        id: 4, 
        name: 'Chrono Smartwatch', 
        category: 'Watch', 
        description: 'Fitness tracking and elegant design in one.', 
        price: 349, 
        qty: 34, 
        image: ChronoWatchImage,
        overview: 'The Chrono Smartwatch seamlessly bridges the gap between classic horology and modern digital utility. Encased in a scratch-resistant marine-grade steel housing, it continuously monitors your vital signs, sleep cycles, and daily workout performance with high-precision biometric sensors. Whether you are running on a trail with standalone GPS tracking or stepping into a corporate meeting, its customizable ambient face layouts match your personal style perfectly.'
    },
    { 
        id: 5, 
        name: 'ROG Gaming Mouse', 
        category: 'Gaming', 
        description: 'Precision tracking built for competitive play.', 
        price: 129, 
        qty: 52, 
        image: ROGMouseImage,
        overview: 'Dominate the competitive ladder with the ultra-responsive ROG Gaming Mouse. Equipped with an ultra-high DPI optical tracking engine, it registers micro-movements instantly without interpolation or cursor drift. The durable mechanical switches are rated for millions of rapid clicks, providing crisp tactile feedback. Its optimized geometric shape accommodates hybrid grip styles, and customizable lighting profiles sync seamlessly with the rest of your desk setup.'
    },
    { 
        id: 6, 
        name: 'ROG Earbuds', 
        category: 'Audio', 
        description: 'Rich sound and seamless everyday portability.', 
        price: 179, 
        qty: 17, 
        image: ROGEarbudsImage,
        overview: 'Engineered for non-stop lifestyles, the ROG Earbuds provide deep acoustics and low-latency audio processing inside a pocket-sized package. They feature customizable ear tips that lock firmly into position during workouts while creating an acoustic seal against ambient noise. Built-in beamforming microphones isolate your voice during business calls or in-game lobby chats, making them a versatile companion for mobile gaming, music playlists, and voice communication.'
    },
    { 
        id: 7, 
        name: 'ROG Laptop', 
        category: 'Laptop', 
        description: 'High-performance laptop tailored for gaming and work.', 
        price: 1599, 
        qty: 17,  
        image: ROGLaptopImage,
        overview: 'The ROG Laptop is an absolute beast crafted for hardcore gamers and creative professionals who refuse to compromise on visual fidelity. Armed with a top-tier dedicated graphics processing unit and high-bandwidth memory, it pushes high frame rates in modern titles and slashes render times in 3D modeling environments. Liquid-metal cooling systems draw heat away rapidly, keeping the machine running efficiently even under sustained processing strain.'
    },
    { 
        id: 8, 
        name: 'ASUS Monitor', 
        category: 'Display', 
        description: 'Crisp visuals with vibrant color and sharp detail.', 
        price: 399, 
        qty: 25, 
        image: ASUSMonitorImage,
        overview: 'Elevate your workspace view with this premium ASUS Monitor, designed to present incredible depth and clarity. Boasting wide horizontal and vertical viewing angles, it retains accurate colors and sharp contrasts from any perspective. It features integrated eye-care filters to minimize blue light output and screen flicker, drastically reducing strain during long work shifts or late-night entertainment marathons.'
    },
    { 
        id: 9, 
        name: 'Ankeri Wireless Charger', 
        category: 'Accessory', 
        description: 'Fast wireless charging with a premium finish.', 
        price: 69, 
        qty: 67, 
        image: AnkeriChargerImage,
        overview: 'Declutter your desk workspace using the Ankeri Wireless Charger. This premium charging surface intelligently identifies your device to deliver optimized, safe power outputs up to maximum fast-charging speeds. Designed with non-slip silicone materials, it keeps your smartphone safely anchored in place, while safety sensors monitor temperatures to prevent overheating or short circuits during overnight charging cycles.'
    },
    { 
        id: 10, 
        name: 'Red Dragon Gamepad', 
        category: 'Gaming', 
        description: 'Comfortable control for console and PC gaming.', 
        price: 89, 
        qty: 27, 
        image: RedDragonGamepadImage,
        overview: 'Experience fluid, ergonomic gaming layouts across multiple systems with the Red Dragon Gamepad. It features texturized nonslip side panels to keep your thumbs securely positioned through intense battles, precise analog sticks, and pressure-sensitive triggers. With its versatile plug-and-play profile, switching between a home console ecosystem and a desktop computer layout requires zero additional driver installation.'
    }
]

export default products
