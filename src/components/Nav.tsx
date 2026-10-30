import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/laans-logo.png"
            alt="LAANS Consulting"
            width={110}
            height={65}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-8">
          <Link
            href="/reports"
            className="text-sm text-stone-600 hover:text-black transition-colors"
          >
            Reports
          </Link>
          <Link
            href="/about"
            className="text-sm text-stone-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-black bg-[#F0EAD6] hover:bg-[#DDD5BB] px-4 py-1.5 transition-colors"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
