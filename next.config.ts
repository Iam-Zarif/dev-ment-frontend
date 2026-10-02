import type { NextConfig } from "next";

const backendApiUrl = (process.env.BACKEND_API_URL ?? "http://localhost:5001/api/v1").replace(
	/\/$/,
	"",
);

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: `${backendApiUrl}/:path*`,
			},
		];
	},
};

export default nextConfig;
