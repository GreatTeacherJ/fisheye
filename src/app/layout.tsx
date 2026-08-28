import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Fisheye",
	description: "Gallery de photographe Fisheye",
	icons: {
		icon: "/logo.svg", // chemin relatif à /public
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable}`}>
			<body>{children}</body>
		</html>
	);
}
