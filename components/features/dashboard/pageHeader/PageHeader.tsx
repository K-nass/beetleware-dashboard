"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    title: string;
    description: string;
    buttonText?: string;
    buttonHref?: string;
    onButtonClick?: () => void;
}

export default function PageHeader({ title, description, buttonText, buttonHref, onButtonClick }: PageHeaderProps) {
    const router = useRouter();
    
    const handleClick = (e: React.MouseEvent) => {
        if (onButtonClick) {
            e.preventDefault();
            onButtonClick();
        } else if (buttonHref?.startsWith('#')) {
            e.preventDefault();
            window.location.hash = buttonHref;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>
                {buttonText && buttonHref && (
                    <Link
                        href={buttonHref}
                        onClick={handleClick}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {buttonText}
                    </Link>
                )}
            </div>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    )
}