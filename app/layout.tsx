import Link from 'next/link';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header>
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Home"
              width={50}
              height={50}
              style={{ cursor: 'pointer' }}
              priority={true}
            />
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
