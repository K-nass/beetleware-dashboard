interface FormErrorBannerProps {
  message: string;
}

export function FormErrorBanner({ message }: FormErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {message}
    </div>
  );
}
