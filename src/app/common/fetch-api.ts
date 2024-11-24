import { BASE_URL } from "./helper";

export async function apiCall<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: unknown): Promise<T> {
	try {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		const token = sessionStorage.getItem("token");
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
		const response = await fetch(BASE_URL + url, {
			method,
			headers,
			body: JSON.stringify(body),
		});

		if (response.ok) {
			return (await response.json()) as Promise<T>;
		} else {
			const errorData = await response.json();
			if (response.status === 401 || response.status === 403) {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("userDetail");
				window.location.href = "/";
			}
			throw new Error(`Error: ${response.status} - ${errorData.message}`);
		}
	} catch (error) {
		console.error("API call error:", error);
		throw error;
	}
}
