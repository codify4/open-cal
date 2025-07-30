const sizeVariants = {
    sm: {
        container: "h-20 px-4 py-3",
        title: "text-sm font-semibold",
        subtitle: "text-xs",
        graphic: "w-8 h-8",
    },
    md: {
        container: "h-28 px-5 py-4",
        title: "text-base font-semibold",
        subtitle: "text-sm",
        graphic: "w-10 h-10",
    },
    lg: {
        container: "h-36 px-6 py-5",
        title: "text-lg font-semibold",
        subtitle: "text-sm",
        graphic: "w-12 h-12",
    },
}

const colorVariants = {
    purple: {
        bg: "bg-gradient-to-br from-purple-600 to-purple-800",
        accent: "stroke-purple-300",
        text: "text-purple-100",
    },
    blue: {
        bg: "bg-gradient-to-br from-blue-600 to-blue-800",
        accent: "stroke-blue-300",
        text: "text-blue-100",
    },
    green: {
        bg: "bg-gradient-to-br from-green-600 to-green-800",
        accent: "stroke-green-300",
        text: "text-green-100",
    },
    orange: {
        bg: "bg-gradient-to-br from-orange-600 to-orange-800",
        accent: "stroke-orange-300",
        text: "text-orange-100",
    },
    red: {
        bg: "bg-gradient-to-br from-red-600 to-red-800",
        accent: "stroke-red-300",
        text: "text-red-100",
    },
    yellow: {
        bg: "bg-gradient-to-br from-yellow-500 to-yellow-700",
        accent: "stroke-yellow-200",
        text: "text-yellow-100",
    },
}

export const GraphicDoodle = ({ color, size }: { color: string; size: string }) => {
    const graphics = {
        blue: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Ocean waves with bubbles */}
            <path
                d="M5 25C8 22 12 22 15 25C18 28 22 28 25 25C28 22 32 22 35 25"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M5 30C8 27 12 27 15 30C18 33 22 33 25 30C28 27 32 27 35 30"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle
                cx="12"
                cy="15"
                r="2"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            <circle
                cx="28"
                cy="12"
                r="1.5"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            <circle
                cx="20"
                cy="18"
                r="1"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            </svg>
        ),
        green: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Botanical leaves and vines */}
            <path
                d="M15 35C15 30 18 25 22 22C26 19 30 15 30 10"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M18 28C16 26 16 24 18 22C20 20 22 20 24 22"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M25 18C23 16 23 14 25 12C27 10 29 10 31 12"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M12 32C10 30 10 28 12 26"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            </svg>
        ),
        red: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Abstract flame/energy burst */}
            <path
                d="M20 35C15 30 12 25 15 20C18 15 22 18 25 15C28 12 32 15 30 20C28 25 25 30 20 35Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M20 28C18 25 17 22 19 20C21 18 23 19 24 17C25 15 27 16 26 18C25 20 23 22 20 28Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle
                cx="22"
                cy="12"
                r="1.5"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            </svg>
        ),
        purple: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Mystical swirls and stars */}
            <path
                d="M8 32C12 28 16 32 20 28C24 24 28 28 32 24"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M10 20C14 16 18 20 22 16C26 12 30 16 34 12"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M15 12L17 8L19 12L23 10L21 14L17 16L13 14L15 10Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle
                cx="28"
                cy="20"
                r="1"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            </svg>
        ),
        orange: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Sun rays and geometric patterns */}
            <circle
                cx="20"
                cy="20"
                r="6"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                fill="none"
            />
            <path
                d="M20 8L20 4"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M20 36L20 32"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M32 20L36 20"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M4 20L8 20"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M28.28 11.72L30.71 9.29"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M9.29 30.71L11.72 28.28"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M28.28 28.28L30.71 30.71"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M9.29 9.29L11.72 11.72"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            </svg>
        ),
        yellow: (
            <svg className={sizeVariants[size as keyof typeof sizeVariants].graphic} viewBox="0 0 40 40" fill="none">
            {/* Lightning bolt with sparkles */}
            <path
                d="M25 8L15 22L20 22L15 32L25 18L20 18L25 8Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M30 12L32 10L34 12L32 14Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M8 16L10 14L12 16L10 18Z"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle
                cx="32"
                cy="28"
                r="1"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            <circle
                cx="8"
                cy="30"
                r="1"
                className={colorVariants[color as keyof typeof colorVariants].accent}
                strokeWidth="1.5"
                fill="none"
            />
            </svg>
        ),
    }
  
    return graphics[color as keyof typeof graphics] || graphics.purple
}