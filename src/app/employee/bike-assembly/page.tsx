"use client";
import React, { useState, useEffect } from "react";
import {
	Container,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
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
	Snackbar,
	Alert,
} from "@mui/material";
import { apiCall } from "../../common/fetch-api";
import { useRouter } from "next/navigation";
import { Logout } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";

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

const BikeAssemblyPage = () => {
	const router = useRouter();
	const [bikeType, setBikeType] = useState("");
	const [user, setUser] = useState({ username: "", role: "" });
	const [assembledBikes, setAssembledBikes] = useState<AssemblyInterface[]>([]);
	const [bikes, setBikes] = useState<BikeInterface[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

	const handleBikeChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setBikeType(event.target.value);
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			const findBike = bikes.find((bike) => bike._id === bikeType);
			await apiCall("/assemblies", "POST", {
				name: findBike?.brand,
				bikeId: findBike?._id,
				duration: findBike?.assemblyTime,
			});
			fetchAssembledBikes();
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
			console.error("Error assembling bike:", error);
		}
	};

	const fetchAssembledBikes = async () => {
		try {
			const data: { data: AssemblyInterface[]; count: number } = await apiCall("/assemblies", "GET");
			setAssembledBikes(data.data);
		} catch (error) {
			console.error("Error fetching assembled bikes:", error);
		}
	};

	const fetchBikes = async () => {
		try {
			const data: BikeInterface[] = await apiCall("/bikes", "GET");
			setBikes(data);
		} catch (error) {
			console.error("Error fetching bikes:", error);
		}
	};

	useEffect(() => {
		const userDetail = sessionStorage.getItem("userDetail");
		setUser(userDetail ? JSON.parse(userDetail) : {});
		fetchAssembledBikes();
		fetchBikes();
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userDetail");
		router.push("/");
	};

	return (
		<>
			<AppBar position="static" sx={{ backgroundColor: "darkblue", boxShadow: 3, height: "64px" }}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
						Bike Assembly
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
				{errorMessage && (
					<Snackbar
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						open={errorMessage !== ""}
						autoHideDuration={6000}
						onClose={() => setErrorMessage("")}
						message={errorMessage}
						key={"top" + "right"}
					>
						<Alert severity="error" sx={{ width: "100%" }} onClose={() => setErrorMessage("")}>
							{errorMessage}
						</Alert>
					</Snackbar>
				)}
				<Box my={4}>
					<Box display="flex" justifyContent="space-between">
						<Box width="20%">
							<Card sx={{ p: 2 }}>
								<Typography variant="h6">Select a Bike</Typography>
								<form onSubmit={handleSubmit}>
									<FormControl variant="outlined" fullWidth margin="dense">
										<InputLabel id="bike-label" sx={{ color: "darkblue" }}>
											Bike
										</InputLabel>
										<Select
											labelId="bike-label"
											value={bikeType}
											onChange={handleBikeChange}
											label="Bike"
											sx={{
												borderRadius: 2,
												"& .MuiOutlinedInput-notchedOutline": {
													borderColor: "darkblue",
												},
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: "blue",
												},
												"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
													borderColor: "darkblue",
												},
											}}
										>
											{bikes.map((bike) => (
												<MenuItem key={bike._id} value={bike._id}>
													{bike.brand} - {bike.model} - {bike.assemblyTime}mins
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<Button type="submit" variant="contained" color="primary" fullWidth>
										Submit
									</Button>
								</form>
							</Card>
						</Box>

						<Box width="75%">
							<Typography variant="h6" color="darkblue">
								Assembled Bikes
							</Typography>
							<TableContainer component={Paper} >
								<Table>
									<TableHead sx={{ backgroundColor: "lightblue" }}>
										<TableRow>
											<TableCell>Assembly Name</TableCell>
											<TableCell>Bike Brand</TableCell>
											<TableCell>Start Time</TableCell>
											<TableCell>End Time</TableCell>
											<TableCell>Duration</TableCell>
											<TableCell>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{assembledBikes.map((bike) => (
											<TableRow key={bike._id}>
												<TableCell>{bike.name}</TableCell>
												<TableCell>{bike.bikeId.brand}</TableCell>
												<TableCell>
													{bike.startTime ? new Date(bike.startTime).toLocaleString() : "-"}
												</TableCell>
												<TableCell>
													{bike.endTime ? new Date(bike.endTime).toLocaleString() : "-"}
												</TableCell>
												<TableCell>{bike.duration} mins</TableCell>
												<TableCell sx={{ color: bike.status === "completed" ? "green" : "orange" }}>
													{bike.status}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default BikeAssemblyPage;
