import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations("dashboard");
    return (
        <div>
            <h1>{t('title')}</h1>
        </div>
    );
}