"use client";
import { useEffect, useState } from "react";
import { apiCall } from "./common/fetch-api";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader";
import { Button, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
interface Response {
	token: string;
	user: {
		_id: string;
		username: string;
		role: string;
	};
}

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [loginLoading, setLoginLoading] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		const userDetail = sessionStorage.getItem("userDetail");
		if (token && userDetail) {
			setLoginLoading(true);
			const user = JSON.parse(userDetail);
			if (user.role === "admin") {
				router.push("/admin/dashboard");
			} else {
				router.push("/employee/bike-assembly");
			}
		}
		setLoading(false);
	}, [router]);
	const handleSubmit = async (): Promise<void> => {
		if (!username || !password) {
			setError("Username and password are required");
			return;
		}
		setLoginLoading(true);
		apiCall<Response>("/users/login", "POST", { username, password })
			.then((response) => {
				if ("token" in response && "user" in response) {
					sessionStorage.setItem("token", response.token);
					sessionStorage.setItem("userDetail", JSON.stringify(response.user));
					if (response.user.role === "admin") {
						router.push("/admin/dashboard");
					} else {
						router.push("/employee/bike-assembly");
					}
					// setLoginLoading(false);
				} else {
					console.error("Invalid response");
					setError("Invalid response");
					setLoginLoading(false);
				}
			})
			.catch((error) => {
				console.error(error);
				setError(error.message);
				setLoginLoading(false);
			});
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
			{loading ? (
				<body className="flex justify-center items-center">
					<Loader />
				</body>
			) : (
				<div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
					<Typography variant="h4" gutterBottom component="div" align="center" color="primary">
						Login
					</Typography>
					<div className="mb-4">
						<TextField
							label="Username"
							id="username"
							type="text"
							margin="normal"
							variant="outlined"
							fullWidth
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<TextField
							label="Password"
							id="password"
							type="password"
							margin="normal"
							variant="outlined"
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					{error && <p className="text-red-500 text-center mb-4">{error}</p>}
					{loginLoading ? (
						<div className="flex justify-center">
							<div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
						</div>
					) : (
						<Button
							variant="contained"
							color="primary"
							fullWidth
							startIcon={<LoginIcon />}
							onClick={() => handleSubmit()}
						>
							Login
						</Button>
					)}
				</div>
			)}
		</main>
	);
}
