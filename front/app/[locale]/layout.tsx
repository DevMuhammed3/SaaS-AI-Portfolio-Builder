// app/[locale]/layout.tsx
import Script from "next/script";
import "./globals.css";
import Providers from "@/providers";
import { getMessages } from "@/lib/intl";
import { fredoka } from "./fonts";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>{/* Le reste de tes balises <meta>, <title>, etc. */}</head>
      <body className={`${fredoka.variable} min-h-screen antialiased`}>
        {/* ✅ Google Analytics avec next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MLQZ88C087"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MLQZ88C087');
          `}
        </Script>
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6868e0b8fd0b7e1914ecca64/1ivcqrl1o';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>

        <Providers locale={locale} messages={messages}>
          {children}
          {/* ✅ Tawk.to Script */}
        </Providers>
      </body>
    </html>
  );
}
