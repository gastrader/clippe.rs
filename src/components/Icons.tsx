import { LucideProps, User } from "lucide-react";

export const Icons = {
  user: User,
  logo: (props: LucideProps) => (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64.000000 64.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M460 564 c-99 -42 -140 -71 -140 -98 0 -7 6 -13 13 -13 6 0 26 -3 42
-7 28 -6 37 0 115 79 46 47 82 85 80 84 -3 0 -52 -20 -110 -45z"
        />
        <path
          d="M523 488 c-82 -83 -82 -83 -76 -125 11 -84 59 -44 118 100 24 59 43
107 42 107 -1 0 -39 -37 -84 -82z"
        />
        <path
          d="M287 398 c-9 -7 -23 -29 -31 -48 -8 -19 -26 -46 -40 -59 l-25 -24
-31 27 c-17 14 -40 26 -50 26 -70 0 -112 -74 -74 -128 41 -58 92 -48 176 35
32 31 61 54 65 50 4 -4 -19 -33 -50 -65 -83 -84 -93 -135 -35 -176 34 -24 66
-19 99 13 36 37 37 70 3 111 l-27 31 28 29 c16 16 43 35 62 41 38 12 53 34 53
77 0 56 -78 94 -123 60z m81 -59 c4 -31 -20 -53 -47 -44 -47 15 -31 79 18 73
20 -2 27 -9 29 -29z m-229 -83 l22 -24 -27 -21 c-32 -25 -38 -26 -58 -5 -21
21 -20 51 2 63 26 16 36 13 61 -13z m129 -129 c19 -32 8 -60 -25 -65 -20 -3
-53 21 -53 37 0 15 42 62 52 59 5 -2 17 -16 26 -31z"
        />
      </g>
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  ),
};