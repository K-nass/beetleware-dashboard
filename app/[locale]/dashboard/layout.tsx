import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Sidebar from '../../../components/ui/navigation/sidebar/Sidebar';
import Navbar from '../../../components/ui/navigation/navbar/Navbar';
import { ProtectedRoute } from '@/components/ui/layout/ProtectedRoute';


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}


export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      {/* <ProtectedRoute> */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1 pt-16">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
              {children}
            </main>
          </div>
        </div>
      {/* </ProtectedRoute> */}
    </NextIntlClientProvider>
  );
}