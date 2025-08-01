import { AuthProvider } from "@/components/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Header from "./_components/header";
import "./globals.css";

const pretendard = localFont({
  src: "../font/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
// const notoSans = Noto_Sans_KR({
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Piece Admin",
  description: "피스 어드민 웹페이지",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable}`}
    >
      <body
        className={`${pretendard.className} antialiased h-screen flex flex-col`}
      >
        <AuthProvider>
          <SidebarProvider className="flex flex-col [--header-height:calc(--spacing(12))] md:[--header-height:calc(--spacing(20))]">
            <Toaster />
            <Header />
            <div className="flex-1">{children}</div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
