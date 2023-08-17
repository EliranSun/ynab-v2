import { useState } from "react";

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const efficiency = randomIntFromInterval(0, 100);

const Question = ({ item, onSliderChange, isError = false }) => {
	const [isChanged, setIsChanged] = useState(false);
	return (
		<div style={{ color: isError && !isChanged ? "tomato" : "initial" }}>
			<p>{item.question}</p>
			<div style={{ display: "flex" }}>
				<pre>{item.min}</pre>
				<input
					// min={item.min}
					// max={item.max}
					// defaultValue={item.min}
					step={item.max - item.min === 1 ? 100 : 1}
					type="range"
					onChange={() => {
						if (isChanged) {
							return;
						}
						onSliderChange();
						setIsChanged(true);
					}}
				/>
				<pre>{item.max}</pre>
			</div>
		</div>
	);
};

const Inputs = [
	{ question: "How much sleep do you get?", min: 0, max: 24 },
	{ question: "How much do you work?", min: 0, max: 24 },
	{
		question: "What's the average working hours in your country/industry?",
		min: 0,
		max: 24,
	},
	{ question: "How many projects are you working on?", min: 0, max: 100 },
	{
		question: "How many cups of coffee are you drinking per day?",
		min: 0,
		max: 50,
	},
	{ question: "Are you ketogenic?", min: 0, max: 1 },
	{
		question: "If not, how healthy do you consider yourself?",
		min: 0,
		max: 100,
	},
	{
		question: "Do you use keyboard shortcuts?",
		min: 0,
		max: 1,
	},
	{
		question: "Do you use VIM?",
		min: 0,
		max: 1,
	},
	{ question: "Do you have a partner?", min: 0, max: 1 },
];

const Outputs = [
	{
		question:
			"What's your average time when delivering a task (in storypoints)?",
		min: 0,
		max: 100,
	},
	{ question: "Are you feeling sleepy?", min: 0, max: 1 },
	{
		question:
			"What's your income (monthly, avg)? Please leave at 0 if you are scared for your privacy (chicken).",
		min: 0,
		max: 1000000,
	},
	{
		question:
			"How much is your partner pleased with you? (if you don't have one, mark 0 to show how lame you are.)",
		min: 0,
		max: 100,
	},
	{ question: "How Strange are you?", min: 0, max: 100 },
	{
		question:
			"How much time did you spend being on this page, filling out these questions (in minutes)?",
		min: 0,
		max: 60,
	},
];
const Efficient = () => {
	const [error, setError] = useState(false);
	const [slidersChangedCount, setSlidersChangedCount] = useState(0);
	const [showCalculation, setShowCalculation] = useState(false);

	if (localStorage.getItem("efficiency")) {
		const savedEfficiency = localStorage.getItem("efficiency");
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					maxWidth: "90vw",
					padding: "20px",
				}}
			>
				<h1>
					YOU ARE{" "}
					<span
						style={{ color: Number(savedEfficiency) > 60 ? "olive" : "tomato" }}
					>
						{savedEfficiency}%
					</span>{" "}
					EFFICIENT. CONGRAGULATIONS.
				</h1>
				<h2>You can't change who you are. Deal with it.</h2>
				<h6>
					(If you think you can, you might. But like Raskolnikov, you'll have to
					deal with the consequences)
				</h6>
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				maxWidth: "90vw",
				padding: "20px",
			}}
		>
			<h1>Just how efficient are you?</h1>
			<h4>Calculate it now, with this - scientists approved - tool.</h4>
			<div style={{ width: "100%" }}>
				<h2>INPUTS</h2>
				{Inputs.map((input) => (
					<Question
						isError={error}
						item={input}
						onSliderChange={() =>
							setSlidersChangedCount(slidersChangedCount + 1)
						}
					/>
				))}

				<h2>OUTPUTS</h2>

				{Outputs.map((output) => (
					<Question
						isError={error}
						item={output}
						onSliderChange={() =>
							setSlidersChangedCount(slidersChangedCount + 1)
						}
					/>
				))}

				<h2>FINAL QUESTION YOU SON OF A BITCH (SORRY FOR THE LANGUAGE)</h2>
				<Question
					isError={error}
					onSliderChange={() => setSlidersChangedCount(slidersChangedCount + 1)}
					item={{
						min: 0,
						max: 100,
						question:
							"How much (in percentage) do you think your efficiency is?",
					}}
				/>
			</div>
			{error && (
				<h4
					style={{
						color: "tomato",
						position: "fixed",
						backgroundColor: "white",
						padding: "8px",
						border: "dashed 5px tomato",
					}}
				>
					PLEASE FILL IN ALL QUESTIONS
				</h4>
			)}
			<button
				style={{ margin: "20px 20px 60px", height: "48px" }}
				onClick={() => {
					if (slidersChangedCount < Inputs.length + Outputs.length + 1) {
						setError(true);
						return;
					}
					setError(false);
					setShowCalculation(true);
					localStorage.setItem("efficiency", efficiency);
				}}
			>
				CALCULATE EFFICIENCY
			</button>
			{showCalculation && (
				<h1>YOU ARE {efficiency}% EFFICIENT. CONGRAGULATIONS.</h1>
			)}
		</div>
	);
};

export default Efficient;
