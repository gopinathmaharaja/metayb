import * as React from "react";
import { DefaultizedPieValueType } from "@mui/x-charts/models";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

interface PieData {
	label: string;
	value: number;
}

const sizing = {
	// margin: { right: 5 },
	width: 400,
	height: 200,
};

export function PieChartComponent(props: Readonly<{ data: PieData[] }>): JSX.Element {
	const TOTAL = props.data.map((item) => item.value).reduce((a, b) => a + b, 0);

	const getArcLabel = (params: DefaultizedPieValueType) => {
		const percent = params.value / TOTAL;
		return `${(percent * 100).toFixed(0)}%`;
	};

	if (!props.data) {
		return <></>;
	}

	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<PieChart
				series={[
					{
						outerRadius: 80,
						data: props.data,
						arcLabel: getArcLabel,
					},
				]}
				sx={{
					[`& .${pieArcLabelClasses.root}`]: {
						fill: "white",
						fontSize: 14,
					},
				}}
				{...sizing}
			/>
		</div>
	);
}
