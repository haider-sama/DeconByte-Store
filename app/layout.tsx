import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "./components/nav/NavBar";
import Footer from "./components/footer/Footer";
import CartProvider from "./components/providers/CartProvider";
import { Toaster } from "react-hot-toast";
import { getCurrentUser } from "@/actions/getCurrentUser";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata = {
  title: {
    default: 'DeconByte | Store ',
    template: '%s | DeconByte'
  },
  description: {
    default: 'DeconByte is a premier eCommerce store offering a diverse range of high-quality tech gadgets and accessories. Experience seamless shopping with top-notch customer service and fast shipping at DeconByte.',
    template: '%s | DeconByte'
  },
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript', 'eCommerce', 'DeconByte'],
  authors: [
    { name: 'Haider', url: 'https://github.com/haider-sama' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}
      text-slate-700`}>
      <Toaster 
        toastOptions={{
          style: {
            background: "rgb(51, 65, 85)",
            color: "#fff"
          },
        }} />
      <CartProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
        </div>
        </CartProvider>
      </body>
    </html>
  );
}
