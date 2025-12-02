import { fetchAuthSession } from 'aws-amplify/auth';

export async function getCurrentUserRole() {
    try {
        const session = await fetchAuthSession();
        const role = session.tokens?.idToken?.payload['custom:role'];
        return role as string | undefined;
    } catch (error) {
        console.error('Error fetching auth session', error);
        return undefined;
    }
}

export const ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    CUSTOMER: 'customer',
    GUEST: 'guest',
};
