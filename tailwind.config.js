/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F6EF7',
            },
            borderRadius: {
                'lg': '12px',
                'xl': '16px',
            }
        },
    },
    plugins: [],
}
