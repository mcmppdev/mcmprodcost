import "./globals.css";

export const metadata = {
  title: "MCM Production Cost",
  description: "Mobile-first cup production cost calculators.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "MCM Cost",
    statusBarStyle: "default"
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f7f4ed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
