import SettingsContent from "@/components/features/settings/SettingsContent";

export const metadata = {
  title: "Platform Settings",
  description: "Configure platform rules and settings"
};

export default function SettingsPage() {
  return (
    <div className="p-6">
      <SettingsContent />
    </div>
  );
}
