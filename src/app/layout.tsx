export const metadata = {
  title: 'GPA Calculator | MAMM',
  description: 'A simple and intuitive GPA calculator for students',
  keywords: ['GPA', 'calculator', 'education', 'grades'],
}

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
