"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

const EmployeeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const [authorizedUser, setAuthorizedUser] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		const userDetail = sessionStorage.getItem("userDetail");
		if (!token || !userDetail) {
			router.push("/unauthorized");
			setLoading(false);
			return;
		}

		const user = JSON.parse(userDetail);
		if (user.role !== "user") {
			router.push("/unauthorized");
			setLoading(false);
		} else {
			setAuthorizedUser(true);
			setLoading(false);
		}
	}, [router]);

	return (
		<main className="min-h-screen bg-gray-100">
			{loading ? <Loader /> : authorizedUser && <>{children}</>}
		</main>
	);
};

export default EmployeeLayout;
