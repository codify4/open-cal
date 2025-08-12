const sizeVariants = {
  sm: {
    container: 'h-20 px-4 py-3',
    title: 'text-sm font-semibold',
    subtitle: 'text-xs',
    graphic: 'w-8 h-8',
  },
  md: {
    container: 'h-28 px-5 py-4',
    title: 'text-base font-semibold',
    subtitle: 'text-sm',
    graphic: 'w-10 h-10',
  },
  lg: {
    container: 'h-36 px-6 py-5',
    title: 'text-lg font-semibold',
    subtitle: 'text-sm',
    graphic: 'w-12 h-12',
  },
};

const colorVariants = {
  purple: {
    bg: 'bg-gradient-to-br from-purple-600 to-purple-800',
    accent: 'stroke-purple-300',
    text: 'text-purple-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-600 to-blue-800',
    accent: 'stroke-blue-300',
    text: 'text-blue-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-600 to-green-800',
    accent: 'stroke-green-300',
    text: 'text-green-100',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-600 to-orange-800',
    accent: 'stroke-orange-300',
    text: 'text-orange-100',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-600 to-red-800',
    accent: 'stroke-red-300',
    text: 'text-red-100',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
    accent: 'stroke-yellow-200',
    text: 'text-yellow-100',
  },
};

export const GraphicDoodle = ({
  color,
  size,
}: {
  color: string;
  size: string;
}) => {
  const safeColor = colorVariants[color as keyof typeof colorVariants]
    ? color
    : 'blue';
  const graphics = {
    blue: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Ocean waves with bubbles */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M5 25C8 22 12 22 15 25C18 28 22 28 25 25C28 22 32 22 35 25"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M5 30C8 27 12 27 15 30C18 33 22 33 25 30C28 27 32 27 35 30"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="12"
          cy="15"
          fill="none"
          r="2"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="28"
          cy="12"
          fill="none"
          r="1.5"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="20"
          cy="18"
          fill="none"
          r="1"
          strokeWidth="1.5"
        />
      </svg>
    ),
    green: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Botanical leaves and vines */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M15 35C15 30 18 25 22 22C26 19 30 15 30 10"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M18 28C16 26 16 24 18 22C20 20 22 20 24 22"
          fill="none"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M25 18C23 16 23 14 25 12C27 10 29 10 31 12"
          fill="none"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M12 32C10 30 10 28 12 26"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    ),
    red: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Abstract flame/energy burst */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M20 35C15 30 12 25 15 20C18 15 22 18 25 15C28 12 32 15 30 20C28 25 25 30 20 35Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M20 28C18 25 17 22 19 20C21 18 23 19 24 17C25 15 27 16 26 18C25 20 23 22 20 28Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="22"
          cy="12"
          fill="none"
          r="1.5"
          strokeWidth="1.5"
        />
      </svg>
    ),
    purple: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Mystical swirls and stars */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M8 32C12 28 16 32 20 28C24 24 28 28 32 24"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M10 20C14 16 18 20 22 16C26 12 30 16 34 12"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M15 12L17 8L19 12L23 10L21 14L17 16L13 14L15 10Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="28"
          cy="20"
          fill="none"
          r="1"
          strokeWidth="1.5"
        />
      </svg>
    ),
    orange: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Sun rays and geometric patterns */}
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="20"
          cy="20"
          fill="none"
          r="6"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M20 8L20 4"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M20 36L20 32"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M32 20L36 20"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M4 20L8 20"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M28.28 11.72L30.71 9.29"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M9.29 30.71L11.72 28.28"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M28.28 28.28L30.71 30.71"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M9.29 9.29L11.72 11.72"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    ),
    yellow: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Lightning bolt with sparkles */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M25 8L15 22L20 22L15 32L25 18L20 18L25 8Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M30 12L32 10L34 12L32 14Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M8 16L10 14L12 16L10 18Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="32"
          cy="28"
          fill="none"
          r="1"
          strokeWidth="1.5"
        />
        <circle
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          cx="8"
          cy="30"
          fill="none"
          r="1"
          strokeWidth="1.5"
        />
      </svg>
    ),
    pink: (
      <svg
        className={sizeVariants[size as keyof typeof sizeVariants].graphic}
        fill="none"
        viewBox="0 0 40 40"
      >
        {/* Birthday cake with candles */}
        <path
          className={
            colorVariants[safeColor as keyof typeof colorVariants].accent
          }
          d="M20 35C15 30 12 25 15 20C18 15 22 18 25 15C28 12 32 15 30 20C28 25 25 30 20 35Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  };

  return graphics[safeColor as keyof typeof graphics] || graphics.purple;
};
