/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 * @type {string[]} 
 */
export const publicRoutes = [
    '/', '/email-verification', '/get-reset-link', '/password-reset'
];

/**
 * An array of routes that are used for authentication
 * These routes redirect logged in users to settings page
 * @type {string[]} 
 */
export const authRoutes = [
    '/signin',
    '/register',
]


export const protectedRoutes = [
    '/profile',
]

/**
 * An array of routes that are used for api authentication routes
 * These routes that start with this prefix are used for API
 * @type {string} 
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirects back after loging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/profile';