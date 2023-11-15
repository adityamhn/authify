// styles
import "./globals.scss";
import "antd/dist/reset.css";

// react-query
import QueryClientContext from "@/components/common/constants/QueryClient";

// fonts
import { Inter } from "next/font/google";
import StoreProvider from "@/components/common/constants/StoreProvider";
import AntConfig from "@/components/common/constants/AntConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Authify",
  description: "Build your own authentication system with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <QueryClientContext>
            {children}
          </QueryClientContext>
        </StoreProvider>
      </body>
    </html>
  );
}
