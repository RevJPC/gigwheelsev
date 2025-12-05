import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/amplify_outputs.json';

const { runWithAmplifyServerContext } = createServerRunner({
    config: outputs
});

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();



    const authenticated = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);

                return session.tokens !== undefined;
            } catch (error) {

                return false;
            }
        },
    });

    const isProtectedCustomerRoute = request.nextUrl.pathname.startsWith('/customer') &&
        !request.nextUrl.pathname.startsWith('/customer/vehicles');

    const isOnDashboard = isProtectedCustomerRoute ||
        request.nextUrl.pathname.startsWith('/employee') ||
        request.nextUrl.pathname.startsWith('/admin');

    if (isOnDashboard && !authenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login
         * - signup
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|signup|privacy-policy|data-deletion).*)',
    ],
};
