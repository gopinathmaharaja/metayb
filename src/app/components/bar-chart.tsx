import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

interface BarChartInterface {
	user: string;
	[model: string]: number | string;
}

const chartSetting = {
	yAxis: [
		{
			label: "Total Count",
		},
	],
	width: 800,
	height: 300,
	sx: {
		[`.${axisClasses.left} .${axisClasses.label}`]: {
			transform: "translate(-10px, 0)",
		},
	},
};

export function BarChartComponent(props: Readonly<{ data: BarChartInterface[] }>): JSX.Element {
	const uniqueKeys = Array.from(
		props.data.reduce((keys, item) => {
		  Object.keys(item).forEach((key: string) => {
			if (key !== "user") keys.add(key); // Exclude the 'user' key
		  });
		  return keys;
		}, new Set<string>())
	  );
	  
	  const series = uniqueKeys.map((key: string) => ({ dataKey: key, label: key }));
	  
	return (
		<BarChart
			dataset={props.data}
			xAxis={[{ scaleType: "band", dataKey: "user" }]}
			series={series}
			{...chartSetting}
		/>
	);
}
