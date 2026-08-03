export default function Footer() {
  return (
    <footer className="mt-8 bg-slate-900 px-6 py-10 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <h3 className="text-xl font-semibold text-white">CubeTech</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Premium gadgets, smart devices, and next-gen accessories crafted for modern life.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/" className="transition hover:text-white">Home</a></li>
            <li><a href="/shop" className="transition hover:text-white">Shop</a></li>
            <li><a href="/categories" className="transition hover:text-white">Categories</a></li>
            <li><a href="/cart" className="transition hover:text-white">Cart</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Email: hello@cubetech.com</li>
            <li>Phone: +1 (800) 555-0188</li>
            <li>Location: 120 Tech Avenue, San Diego, CA</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 border-t border-slate-800 pt-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CubeTech. All rights reserved.
      </div>
    </footer>
  )
}
