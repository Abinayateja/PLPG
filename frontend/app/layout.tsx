import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UserFlowProvider } from "@/context/UserFlowContext";
import ForceLogout from "@/components/ForceLogout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserFlowProvider>
            <ForceLogout />
            {children}
          </UserFlowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}