'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // strict check
        const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');

        if (!token) {
            console.log('AuthGuard: No token found. Redirecting to login.');
            const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
            router.replace(redirectUrl); // use replace to prevent back button loops
        } else {
            setAuthorized(true);
        }
    }, [router, pathname]);

    // Show nothing while checking (or a spinner)
    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
