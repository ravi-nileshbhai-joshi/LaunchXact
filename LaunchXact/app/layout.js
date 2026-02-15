import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'LaunchXact - Discover Next Gen SaaS',
  description: 'A curated platform where founders showcase their products and early adopters discover new software.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
