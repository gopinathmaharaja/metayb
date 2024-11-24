"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
	Container,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
	AppBar,
	Toolbar,
	IconButton,
	Avatar,
	Button,
} from "@mui/material";
import { apiCall } from "../../common/fetch-api";
import { useRouter } from "next/navigation";
import { Logout } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";
import { PieChartComponent } from "../../components/pie-chart";
import { BarChartComponent } from "../../components/bar-chart";
import { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export interface AssemblyInterface {
	_id: string;
	userId: { username: string };
	bikeId: { brand: string };
	name: string;
	startTime: Date;
	endTime?: Date;
	duration?: number;
	status: "processing" | "completed";
}

export interface BikeInterface {
	_id: string;
	brand: string;
	model: string;
	price: number;
	assemblyTime: number;
}

interface ChartData {
	_id?: string;
	count?: number;
	label?: string;
	value?: number;
}

interface BarChartInterface {
	user: string;
	[model: string]: number | string;
}

interface DashboardData {
	statusGroup?: ChartData[];
	userGroup?: ChartData[];
	bikeGroup?: ChartData[];
	userByBikeGroup?: BarChartInterface[];
}

const AdminDashboardPage = () => {
	const router = useRouter();
	const [user, setUser] = useState({ username: "", role: "" });
	const [assembledBikes, setAssembledBikes] = useState<AssemblyInterface[]>([]);
	const [dashboardData, setDashboardData] = useState<DashboardData>({});
	const [date, setDate] = React.useState<Dayjs | null>(null);

	const fetchAssembledBikes = useCallback(async () => {
		try {
			const query = date ? `?date=${date.format("YYYY-MM-DD")}` : "";
			const data: { data: AssemblyInterface[]; count: number } = await apiCall("/assemblies" + query, "GET");
			setAssembledBikes(data.data);
		} catch (error) {
			console.error("Error fetching assembled bikes:", error);
		}
	}, [date]);
	const fetchDashBoardData = useCallback(async () => {
		try {
			const query = date ? `?date=${date.format("YYYY-MM-DD")}` : "";
			const data: DashboardData = await apiCall("/assemblies/admin/dashboard" + query, "GET");

			const formatChartData: DashboardData = {
				statusGroup: data.statusGroup?.map((item) => ({
					label: item._id ?? "",
					value: item.count ?? 0,
				})),
				userGroup: data.userGroup?.map((item) => ({
					label: item._id ?? "",
					value: item.count ?? 0,
				})),
				bikeGroup: data.bikeGroup?.map((item) => ({
					label: item._id ?? "",
					value: item.count ?? 0,
				})),
				userByBikeGroup: data.userByBikeGroup ?? [],
			};

			setDashboardData(formatChartData);
		} catch (error) {
			console.error("Error fetching assembled bikes:", error);
		}
	}, [date]);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userDetail");
		router.push("/");
	};

	useEffect(() => {
		const userDetail = sessionStorage.getItem("userDetail");
		setUser(userDetail ? JSON.parse(userDetail) : {});
		fetchAssembledBikes();
		fetchDashBoardData();
	}, [date, fetchAssembledBikes, fetchDashBoardData]);

	return (
		<>
			<AppBar position="static" sx={{ backgroundColor: "darkblue", boxShadow: 3, height: "64px" }}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
						Admin Dashboard
					</Typography>
					{user ? (
						<>
							<Avatar sx={{ bgcolor: deepOrange[500], width: 30, height: 30 }}>U</Avatar>
							<Typography
								variant="subtitle1"
								component="span"
								sx={{ ml: 2, color: "white", fontWeight: "bold" }}
							>
								{user.username}
							</Typography>
							<IconButton onClick={handleLogout}>
								<Logout sx={{ color: "white" }} />
							</IconButton>
						</>
					) : (
						<></>
					)}
				</Toolbar>
			</AppBar>

			<Container>
				<Box display="flex" sx={{ mt: 2 }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer
							components={["DatePicker"]}
							sx={{
								"& .MuiInputBase-root": {
									backgroundColor: "#f0f0f0",
									borderRadius: 8,
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								},
								"& .MuiIconButton-root": {
									color: "#333",
									backgroundColor: "#e0e0e0",
									"&:hover": {
										backgroundColor: "#ccc",
									},
								},
								"& .MuiTypography-root": {
									color: "#444",
									fontWeight: "bold",
								},
							}}
						>
							<DatePicker label="Select Date" value={date} onChange={(date) => setDate(date)} />
						</DemoContainer>
					</LocalizationProvider>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => setDate(null)}
						sx={{
							alignSelf: "center",
							marginLeft: 2,
							height: "40px",
							borderColor: "darkblue",
							color: "darkblue",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							"&:hover": {
								borderColor: "darkblue",
								backgroundColor: "rgba(0, 0, 139, 0.1)",
							},
						}}
					>
						Clear
					</Button>
				</Box>
				<Box my={4}>
					<Box display="flex" justifyContent="space-between">
						<Box width="30%">
							<Card sx={{ p: 2 }}>
								<Typography variant="h6">User Report</Typography>
								<PieChartComponent
									data={
										dashboardData.userGroup?.map((item) => ({
											label: item.label ?? "",
											value: item.value ?? 0,
										})) ?? []
									}
								/>
							</Card>
						</Box>
						<Box width="30%">
							<Card sx={{ p: 2 }}>
								<Typography variant="h6">Bike Report</Typography>
								<PieChartComponent
									data={
										dashboardData.bikeGroup?.map((item) => ({
											label: item.label ?? "",
											value: item.value ?? 0,
										})) ?? []
									}
								/>
							</Card>
						</Box>
						<Box width="30%">
							<Card sx={{ p: 2 }}>
								<Typography variant="h6">Status Report</Typography>
								<PieChartComponent
									data={
										dashboardData.statusGroup?.map((item) => ({
											label: item.label ?? "",
											value: item.value ?? 0,
										})) ?? []
									}
								/>
							</Card>
						</Box>
					</Box>
					<Box width="100%" sx={{ mt: 2 }}>
						<Card sx={{ p: 2, paddingLeft: 5 }}>
							<BarChartComponent data={dashboardData.userByBikeGroup ?? []} />
						</Card>
					</Box>
					<Box width="100%" sx={{ mt: 2 }}>
						<Card sx={{ p: 2 }}>
							<Typography variant="h6">Assembled Bikes</Typography>
							<TableContainer component={Paper}>
								<Table>
									<TableHead sx={{ backgroundColor: "lightblue" }}>
										<TableRow>
											<TableCell>Assembly Name</TableCell>
											<TableCell>Bike Brand</TableCell>
											<TableCell>User</TableCell>
											<TableCell>Start Time</TableCell>
											<TableCell>End Time</TableCell>
											<TableCell>Duration</TableCell>
											<TableCell>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{assembledBikes.length === 0 ? (
											<TableRow>
												<TableCell colSpan={7} sx={{ textAlign: "center" }}>
													No Assembled Bikes
												</TableCell>
											</TableRow>
										) : (
											assembledBikes.map((bike) => (
												<TableRow key={bike._id}>
													<TableCell>{bike.name}</TableCell>
													<TableCell>{bike.bikeId.brand}</TableCell>
													<TableCell>{bike.userId.username}</TableCell>
													<TableCell>
														{bike.startTime
															? new Date(bike.startTime).toLocaleString()
															: "-"}
													</TableCell>
													<TableCell>
														{bike.endTime ? new Date(bike.endTime).toLocaleString() : "-"}
													</TableCell>
													<TableCell>{bike.duration} mins</TableCell>
													<TableCell
														sx={{
															color: bike.status === "completed" ? "green" : "orange",
														}}
													>
														{bike.status}
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Card>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default AdminDashboardPage;
