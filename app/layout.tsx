import Link from 'next/link';
import Image from 'next/image';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col bg-gray-100 h-screen">
        <header className="p-4">
          <Link href="/" className="inline-block">
            <Image
              src="/favicon.ico"
              alt="Home"
              width={50}
              height={50}
              className="cursor-pointer rounded-full hover:opacity-80"
              priority={true}
            />
          </Link>
        </header>
        <div className="flex-grow px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
