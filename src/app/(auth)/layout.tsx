export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-black p-4 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm transition-colors duration-200">
                {children}
            </div>
        </div>
    );
}