import { getServerAccessToken } from "@/lib/auth/get-server-token";
import SettingsNav from "@/components/features/settings/SettingsNav";

interface SettingsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SettingsLayout({ children, modal, params }: SettingsLayoutProps) {
  const token = await getServerAccessToken();

  const { locale } = await params;
  const base = `/${locale}/dashboard/settings`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure platform rules and settings</p>
      </div>

      <SettingsNav base={base} />

      <div>{children}</div>
      {modal}
    </div>
  );
}
