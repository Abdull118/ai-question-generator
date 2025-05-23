// layout.js or _app.js or RootLayout.js
// app/layout.tsx  (first file that runs on every page)
import './globals.css';

export const metadata = {
  title: "Violet's App",
  description: 'Generated by Next.js',
  // Specify the path to the manifest and the favicon
  icons: {
    icon: '/favicon192.ico', // 192x192 is commonly used for the home screen icon
    apple: '/favicon192.ico', // For Apple devices (optional)
    // You can add other sizes for different platforms
  },
  themeColor: '#ffffff',  // This can be the background color of the app when installed
}

import './globals.css'; // Import your global styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        {/* Favicon and PWA icons */}
        <link rel="icon" href="/favicon16x16.ico" type="image/x-icon" sizes="16x16" />
        <link rel="icon" href="/favicon32.ico" type="image/x-icon" sizes="32x32" />
        <link rel="icon" href="/favicon64.ico" type="image/x-icon" sizes="64x64" />

        <link rel="icon" href="/favicon192.ico" type="image/x-icon" sizes="192x192" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="256x256" />
        <link rel="icon" href="/favicon512.ico" type="image/x-icon" sizes="512x512" />
        <meta name="apple-mobile-web-app-title" content="Next.js PWA" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/favicon192.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
