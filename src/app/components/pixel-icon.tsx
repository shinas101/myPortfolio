"use client";
import React from "react";

export type PixelIconName =
    | "robot"
    | "code"
    | "database"
    | "browser"
    | "bug"
    | "keyboard"
    | "cloud"
    | "cog"
    | "box"
    | "star"
    | "rocket";

const ICONS: Record<PixelIconName, React.ReactNode> = {
    star: (
        <g>
            <path d="M30.48 12.19H32v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M28.95 13.71h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M27.43 27.43h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.9 24.38h1.53v3.05H25.9Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.9 15.23h3.05v1.53H25.9Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M24.38 30.47h3.05V32h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M24.38 21.33h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M24.38 16.76h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.86 28.95h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.86 18.28h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 27.43h3.05v1.52h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M21.33 10.66h9.15v1.53h-9.15Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 7.62h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.29 25.9h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.29 16.76h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.29 4.57h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 24.38h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 13.71h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 1.52h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M15.24 22.85h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 18.28h4.58v1.53h-4.58Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M15.24 0h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 24.38h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 13.71h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 1.52h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 25.9h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 16.76h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 4.57h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.67 7.62h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 27.43h3.05v1.52H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M7.62 28.95h1.52v1.52H7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M7.62 18.28h1.52v3.05H7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.1 21.33h1.52v3.05H6.1Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.1 16.76h1.52v1.52H6.1Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M4.57 30.47h3.05V32H4.57Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M4.57 24.38H6.1v3.05H4.57Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.05 15.23H6.1v1.53H3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.05 27.43h1.52v3.04H3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 10.66h9.15v1.53H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 13.71h1.53v1.52H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M0 12.19h1.52v1.52H0Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    code: (
        <g>
            <path d="M30.48 1.53H32v28.95h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 30.48h28.96V32H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="M28.95 3.05H3.05v25.91h25.9ZM15.24 6.1h1.52v6.09h-1.52Zm-6.1 0h4.57v6.09H9.14Zm-3.04 0h1.52v6.09H6.1Zm0 7.62h4.57v6.09H6.1Zm6.09 12.19h-1.52v1.52H9.14v-1.52h1.53v-3.05H9.14v-1.52h1.53v1.52h1.52Zm0 -12.19h1.52v6.09h-1.52Zm6.1 13.71h-4.58v-1.52h4.58Zm-3.05 -7.62v-6.09h4.57v6.09Zm7.62 3.05h-1.53v3.05h1.53v1.52h-1.53v-1.52h-1.52v-3.05h1.52v-1.52h1.53Zm0 -3.05h-1.53v-6.09h1.53Zm0 -7.62h-4.57V6.1h4.57Zm3.04 7.62h-1.52v-6.09h1.52Zm0 -7.62h-1.52V6.1h1.52Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M19.81 7.62h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 15.24h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.67 7.62h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M7.62 15.24h1.52v3.05H7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 0h28.96v1.53H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M0 1.53h1.52v28.95H0Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    robot: (
        <g>
            <path
                d="m30.47 18.28 0 -10.66 -1.52 0 0 9.14 -1.52 0 0 -1.52 -1.53 0 0 12.19 1.53 0 0 -1.53 3.04 0 0 -1.52 1.53 0 0 -6.1 -1.53 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M24.38 12.19h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m6.09 27.43 0 1.52 1.53 0 0 1.53 1.52 0 0 -1.53 13.71 0 0 1.53 1.53 0 0 -1.53 1.52 0 0 -1.52 -19.81 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M22.85 18.28h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.85 10.67h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 16.76h3.04v1.52h-3.04Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 30.48h13.71V32H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 21.33h3.04v1.53h-3.04Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.28 18.28h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.28 1.52h1.53v1.53h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 24.38h4.57v1.52h-4.57Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 0h4.57v1.52h-4.57Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 18.28h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 1.52h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 16.76h3.05v1.52H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m22.85 10.67 0 -1.53 -6.09 0 0 -4.57 1.52 0 0 -1.52 -4.57 0 0 1.52 1.52 0 0 4.57 -6.09 0 0 1.53 13.71 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M9.14 21.33h3.05v1.53H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M7.62 18.28h1.52v3.05H7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M7.62 10.67h1.52v1.52H7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.09 12.19h1.53v3.05H6.09Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m6.09 15.24 -1.52 0 0 1.52 -1.53 0 0 -9.14 -1.52 0 0 10.66 -1.52 0 0 6.1 1.52 0 0 1.52 3.05 0 0 1.53 1.52 0 0 -12.19z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
        </g>
    ),
    database: (
        <g>
            <path
                d="m28.19 27.43 1.53 0 0 -1.52 1.52 0 0 -19.81 -1.52 0 0 1.52 -1.53 0 0 1.52 -4.57 0 0 1.53 -15.24 0 0 1.52 13.72 0 0 7.62 1.52 0 0 -1.52 4.57 0 0 -1.53 1.53 0 0 1.53 -1.53 0 0 1.52 -4.57 0 0 1.52 -1.52 0 0 7.62 -13.72 0 0 1.53 15.24 0 0 -1.53 4.57 0 0 -1.52z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M26.67 4.57h3.05V6.1h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.1 3.05h4.57v1.52H22.1Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M8.38 19.81H22.1v1.52H8.38Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.91 24.38h4.57v1.53H9.91Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.91 15.24h4.57v1.52H9.91Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.91 1.52H22.1v1.53H9.91Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 27.43h4.57v1.52H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 18.29h4.57v1.52H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 9.14h4.57v1.53H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.33 3.05h4.58v1.52H5.33Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 21.33h3.05v3.05H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 12.19h3.05v3.05H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M2.29 4.57h3.04V6.1H2.29Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M2.29 25.91h1.52v1.52H2.29Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m2.29 18.29 1.52 0 0 -1.53 -1.52 0 0 -7.62 1.52 0 0 -1.52 -1.52 0 0 -1.52 -1.53 0 0 19.81 1.53 0 0 -7.62z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
        </g>
    ),
    bug: (
        <g>
            <path
                d="M28.95 18.29v-3.05H25.9v-3.05h-1.52v-1.52h-1.52v1.52h-6.1v1.53h1.53v1.52h1.52v3.05h-1.52v1.52h-1.53v10.67h3.05v-1.52h1.52v-1.53h3.05v-1.52h1.52v3.05h1.53v-6.1H25.9v-6.09h1.53v3.04H32v-1.52Zm-9.14 9.14h-1.52v-1.52h1.52Zm4.57 -4.57h-1.52v1.53h-1.53v-1.53h-1.52v-1.52h1.52v-1.53h1.53v1.53h1.52Zm0 -7.62h-1.52v-1.52h1.52Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path
                d="m27.43 6.1 3.05 0 0 -1.52 -4.58 0 0 4.57 -1.52 0 0 1.52 3.05 0 0 -4.57z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M24.38 28.96h1.52V32h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M21.33 21.34h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m22.86 6.1 -1.53 0 0 3.05 -10.66 0 0 -3.05 -1.53 0 0 4.57 13.72 0 0 -4.57z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M21.33 0h1.53v1.53h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 4.58h1.52V6.1h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 1.53h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 15.24h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16.76 6.1h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 15.24h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M13.71 6.1h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.19 3.05h7.62v1.53h-7.62Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.67 4.58h1.52V6.1h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.67 1.53h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 21.34h1.53v1.52H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 0h1.53v1.53H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="M7.62 12.19H6.1v3.05H3.05v3.05H0v1.52h4.57v-3.04H6.1v6.09H4.57v6.1H6.1v-3.05h1.52v1.52h3.05v1.53h1.52v1.52h3.05V19.81h-1.53v-1.52h-1.52v-3.05h1.52v-1.52h1.53v-1.53h-6.1v-1.52H7.62Zm6.09 13.72v1.52h-1.52v-1.52Zm-3.04 -6.1v1.53h1.52v1.52h-1.52v1.53H9.14v-1.53H7.62v-1.52h1.52v-1.53Zm-1.53 -4.57H7.62v-1.52h1.52Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M6.1 28.96h1.52V32H6.1Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m6.1 9.15 0 -4.57 -4.58 0 0 1.52 3.05 0 0 4.57 3.05 0 0 -1.52 -1.52 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
        </g>
    ),
    browser: (
        <g>
            <path
                d="m1.52 9.14 28.96 0 0 19.81 1.52 0 0 -25.9 -1.52 0 0 4.57 -28.96 0 0 -4.57 -1.52 0 0 25.9 1.52 0 0 -19.81z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M1.52 28.95h28.96v1.53H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="M4.57 12.19v13.72h22.86V12.19Zm9.14 7.62h-1.52v1.52h-1.52v1.53H9.14v-1.53h1.53v-1.52h1.52v-1.52h-1.52v-1.53H9.14v-1.52h1.53v1.52h1.52v1.53h1.52Zm9.15 0h-6.1v-1.52h6.1Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M9.14 4.57h1.53V6.1H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.1 4.57h1.52V6.1H6.1Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.05 4.57h1.52V6.1H3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 1.52h28.96v1.53H1.52Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    cog: (
        <g>
            <path
                d="m29.715 14.48 0 3.05 -1.52 0 0 1.52 3.04 0 0 -6.1 -3.04 0 0 1.53 1.52 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M26.665 23.62h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M26.665 19.05h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M26.665 9.91h1.53v3.04h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M26.665 6.86h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.145 25.14h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.145 22.1h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.145 8.38h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M25.145 5.34h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M23.615 26.67h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M23.615 12.95h1.53v6.1h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M23.615 3.81h1.53v1.53h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.095 25.14h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.095 19.05h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.095 9.91h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M22.095 5.34h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.045 26.67h3.05v1.52h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.045 22.1h3.05v1.52h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.045 8.38h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.045 3.81h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m17.525 29.72 -3.05 0 0 -1.53 -1.52 0 0 3.05 6.09 0 0 -3.05 -1.52 0 0 1.53z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M12.955 23.62h6.09v1.52h-6.09Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m14.475 19.05 3.05 0 0 -1.52 1.52 0 0 -3.05 -1.52 0 0 -1.53 -3.05 0 0 1.53 -1.52 0 0 3.05 1.52 0 0 1.52z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M12.955 6.86h6.09v1.52h-6.09Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m14.475 2.29 3.05 0 0 1.52 1.52 0 0 -3.05 -6.09 0 0 3.05 1.52 0 0 -1.52z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M9.905 26.67h3.05v1.52h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.905 22.1h3.05v1.52h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.905 8.38h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.905 3.81h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M8.385 25.14h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M8.385 19.05h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M8.385 9.91h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M8.385 5.34h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.855 26.67h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.855 12.95h1.53v6.1h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M6.855 3.81h1.53v1.53h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.335 25.14h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.335 22.1h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.335 8.38h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.335 5.34h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.815 23.62h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.815 19.05h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.815 9.91h1.52v3.04h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.815 6.86h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m3.815 17.53 -1.53 0 0 -3.05 1.53 0 0 -1.53 -3.05 0 0 6.1 3.05 0 0 -1.52z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
        </g>
    ),
    rocket: (
        <g>
            <path
                d="m28.19 9.14 0 1.53 -1.52 0 0 1.52 1.52 0 0 1.53 1.52 0 0 -1.53 1.53 0 0 -1.52 -1.53 0 0 -1.53 -1.52 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M28.19 25.91h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m25.14 24.38 -1.52 0 0 1.53 1.52 0 0 1.52 1.53 0 0 -7.62 -1.53 0 0 4.57z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M25.14 4.57h1.53V6.1h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M23.62 18.29h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m20.57 4.57 0 -1.52 -1.52 0 0 -1.53 -1.53 0 0 -1.52 -4.57 0 0 1.52 -1.52 0 0 1.53 -1.53 0 0 1.52 -1.52 0 0 12.19 -1.52 0 0 1.53 1.52 0 0 4.57 -1.52 0 0 1.52 3.04 0 0 -16.76 10.67 0 0 16.76 3.05 0 0 -1.52 -1.52 0 0 -4.57 1.52 0 0 -1.53 -1.52 0 0 -12.19 -1.53 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M17.52 27.43h1.53v3.05h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.9 24.38h10.67v1.53H9.9Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16 18.29h1.52v1.52H16Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M16 10.67h1.52v1.52H16Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M14.48 27.43H16V32h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M14.48 19.81H16v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M14.48 16.76H16v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M14.48 12.19H16v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M14.48 9.14H16v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.95 18.29h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.95 10.67h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M11.43 27.43h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.33 18.29h1.53v1.52H5.33Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m5.33 19.81 -1.52 0 0 7.62 1.52 0 0 -1.52 1.53 0 0 -1.53 -1.53 0 0 -4.57z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M3.81 4.57h1.52V6.1H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M2.29 12.19h1.52v1.53H2.29Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M2.29 6.1h1.52v1.52H2.29Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M2.29 3.05h1.52v1.52H2.29Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M0.76 28.95h1.53v1.53H0.76Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M0.76 4.57h1.53V6.1H0.76Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    box: (
        <g>
            <path
                d="M0 6.1v19.81h32V6.1Zm18.29 18.29H1.52V7.625h16.77Zm6.09 0h-4.57V7.625h3.05v6.09h1.52Zm6.1 0h-4.57V13.715h1.52v-6.09h3.05Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M15.24 9.145h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.67 9.145h1.52v3.05h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.05 21.335h4.57v1.53H3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.05 18.285h4.57v1.53H3.05Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    cloud: (
        <g>
            <path d="M30.47 12.195H32v6.09h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M28.95 18.285h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M28.95 10.665h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M27.43 19.815h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M27.43 9.145h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m24.38 7.625 0 -1.53 -1.53 0 0 3.05 4.58 0 0 -1.52 -3.05 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M21.33 21.335h6.1v1.52h-6.1Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M21.33 9.145h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M21.33 4.575h1.52v1.52h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M19.81 10.665h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M18.28 3.045h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m13.71 19.815 0 4.57 -3.05 0 0 1.52 1.53 0 0 1.52 1.52 0 0 1.53 1.53 0 0 1.52 1.52 0 0 -1.52 1.52 0 0 -1.53 1.53 0 0 -1.52 1.52 0 0 -1.52 -3.05 0 0 -4.57 -4.57 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M13.71 1.525h4.57v1.52h-4.57Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.66 12.195h1.53v1.52h-1.53Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M10.66 3.045h3.05v1.53h-3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 10.665h1.52v1.53H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M9.14 4.575h1.52v1.52H9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m7.62 9.145 -4.57 0 0 1.52 6.09 0 0 -4.57 -1.52 0 0 3.05z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M3.05 21.335h7.61v1.52H3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 19.815h1.53v1.52H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M1.52 10.665h1.53v1.53H1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M0 12.195h1.52v7.62H0Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
    keyboard: (
        <g>
            <path d="M28.19 6.1h1.52v24.38h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M3.81 30.48h24.38V32H3.81Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="M12.95 22.86v6.1h13.72v-6.1Zm12.19 3.05h-1.52v1.52h-3.05v-1.52h-1.52v-1.53h1.52v1.53h3.05v-1.53h1.52Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M20.57 15.24v6.1h6.1v-6.1Zm4.57 4.57h-3.05v-3.04h3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M20.57 7.62v6.1h6.1v-6.1Zm4.57 4.57h-3.05V9.15h3.05Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M12.95 1.53h9.14v1.52h-9.14Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="M19.05 21.34v-6.1h-6.1v6.1Zm-4.57 -4.57h3.04v3.04h-3.04Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path
                d="M19.05 13.72v-6.1h-6.1v6.1Zm-4.57 -4.57h3.04v3.04h-3.04Z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M11.43 0h1.52v1.53h-1.52Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.33 22.86v6.1h6.1v-6.1Zm4.57 4.57H6.86v-3.05H9.9Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.33 15.24v6.1h6.1v-6.1Zm4.57 4.57H6.86v-3.04H9.9Z" fill="currentColor" strokeWidth="1"></path>
            <path d="M5.33 7.62v6.1h6.1v-6.1Zm4.57 4.57H6.86V9.15H9.9Z" fill="currentColor" strokeWidth="1"></path>
            <path
                d="m28.19 6.1 0 -1.52 -4.57 0 0 -1.53 -1.53 0 0 1.53 -18.28 0 0 1.52 24.38 0z"
                fill="currentColor"
                strokeWidth="1"
            ></path>
            <path d="M2.29 6.1h1.52v24.38H2.29Z" fill="currentColor" strokeWidth="1"></path>
        </g>
    ),
};

export interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
    name: PixelIconName;
    size?: number;
    className?: string;
}

export function PixelIcon({ name, size = 20, className = "", style, ...rest }: PixelIconProps) {
    const glyph = ICONS[name];
    if (!glyph) return null;

    return (
        <svg
            viewBox="0 0 32 32"
            width={size}
            height={size}
            fill="currentColor"
            className={className}
            style={{
                imageRendering: "pixelated",
                flexShrink: 0,
                ...style,
            }}
            aria-hidden="true"
            {...rest}
        >
            {glyph}
        </svg>
    );
}

export default PixelIcon;
