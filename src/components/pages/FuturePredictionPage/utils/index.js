import {Categories} from "../../../../constants";
import {Chart, registerables} from "chart.js";
import {useEffect, useMemo} from "react";
import {formatCurrency} from "../../../../utils";
import zoomPlugin from 'chartjs-plugin-zoom';
import chartTrendline from 'chartjs-plugin-trendline';
import {isAfter} from "date-fns";

export const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export let singleton = null;
const IncomeIds = ["81", "82", "83"];
export let chart;
export const createNewChart = ({
    data = [],
    startDate,
    budget = {},
    projectionData = {},
}) => {
    if (singleton) {
        console.info("returning singleton", singleton);
        return singleton;
    }

    Chart.register(...registerables, zoomPlugin, chartTrendline);

    const ctx = document.getElementById("myChart").getContext("2d");

    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map((item) => {
                return new Date(item.date).toLocaleString("en-gb", {
                    day: "numeric",
                    month: "short",
                });
            }),
            // labels: data.map((expense) => expense.name),
            datasets: [
                {
                    label: "Transactions",
                    data: data,
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.2)",
                    ],
                    borderColor: [
                        "rgba(54, 162, 235, 1)",
                    ],
                    borderWidth: 1,
                },
                {
                    label: "Budget",
                    data: budget,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                    ],
                },
                {
                    label: "Projection",
                    data: projectionData,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false
            },
            radius: 0,
            scales: {
                x: {
                    min: startDate,
                    type: "time",
                    time: {
                        unit: "month",
                    },
                    bounds: "ticks",
                },
                y: {
                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return 'red';
                            }

                            return 'rgba(0,0,0,0.1)';
                        },
                    }
                }
            },
            plugins: {
                trendlineLinear: {
                    colorMin: "red",
                    colorMax: "green",
                    lineStyle: "dotted",
                    width: 2,
                    xAxisKey: "x",
                    yAxisKey: "y",
                    projection: true
                },
                zoom: {
                    zoom: {
                        // pan: {
                        //     enabled: true,
                        //     mode: "x",
                        //     modifierKey: "shift",
                        //     scaleMode: "x",
                        // },
                        wheel: {
                            enabled: true,
                        },
                        drag: {
                            enabled: true,
                        },
                        mode: 'x',
                    }
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            const name = context[0]?.raw?.name;
                            const isIncome = context[0].raw.isIncome;
                            const rawAmount = isIncome ? context[0]?.raw?.amount : -context[0]?.raw?.amount;
                            const amount = formatCurrency(rawAmount, false, true);

                            return `${name} - ${amount}`;
                        },
                        label: (context) => {
                            return formatCurrency(context.parsed.y, false, true);
                        },
                        footer: (items) => {
                            let label = "";
                            const date = new Date(items[0].raw.date).toLocaleDateString(
                                "en-GB",
                                {
                                    month: "short",
                                    year: "numeric",
                                    day: "numeric",
                                }
                            );

                            // if (items[0].parsed.y !== null) {
                            //     label += new Intl.NumberFormat("he-IL", {
                            //         style: "currency",
                            //         currency: "ILS",
                            //     }).format(items[0].parsed.y);
                            // }

                            const isIncome = items[0].raw.isIncome;
                            const note = items[0]?.raw?.note;
                            const data = [];

                            // amount && data.push(`Amount: ${amount}`);
                            date && data.push(`Date: ${date}`);
                            // label && data.push(`Total: ${label}`);
                            isIncome && data.push(`Income? ${isIncome ? "Yes" : "No"}`);
                            note && data.push(`Note: ${note}`);

                            return data;
                        },
                    },
                },
                // zoom: {
                //     pan: {
                //         enabled: true,
                //         mode: "x",
                //     },
                //     zoom: {
                //         mode: "x",
                //         wheel: {
                //             enabled: true,
                //         },
                //     },
                // },
            },
        },
    });

    singleton = myChart;
    return myChart;
};

export const calcExpenses = ({
    expenses = [],
    balance = 0,
    initAmount = 0,
    initDate = new Date(),
    categories
}) => {
    let tempAmount = initAmount + balance;
    console.log({expenses, initAmount, initDate})
    const data = [];
    // const recurringExpenses = expenses.filter((expense) => expense.isRecurring);
    const incomeIds = categories.filter(category => category.isIncome).flatMap(category => category.subcategories.map(subcategory => subcategory.id));
    // const monthsCountSinceInitDate = differenceInMonths(new Date(), initDate);

    // for (const expense of recurringExpenses) {
    //     for (let i = 1; i <= monthsCountSinceInitDate; i++) {
    //         const isIncome = incomeIds.includes(expense.subcategoryId);
    //         const y = tempAmount;
    //         tempAmount = isIncome
    //             ? tempAmount - expense.amount
    //             : tempAmount + expense.amount;
    //
    //         data.push({
    //             ...expense,
    //             y,
    //             x: expense.timestamp,
    //             date: expense.timestamp + i * ONE_MONTH_MS,
    //             id: `${expense.id}${i}`,
    //             isIncome,
    //             balance: tempAmount,
    //         })
    //     }
    // }

    if (balance === 0) {
        for (let i = 0; i <= expenses.length - 1; i++) {
            if (isAfter(new Date(expenses[i].date), new Date())) {
                continue;
            }

            const expense = expenses[i];
            const isIncome = incomeIds.includes(expense.subcategoryId);

            const y = tempAmount;
            tempAmount = isIncome
                ? tempAmount + expense.amount
                : tempAmount - expense.amount;

            const x = expense.timestamp;
            const date = expense.timestamp;

            data.push({
                balance: tempAmount,
                ...expense,
                x,
                y,
                date,
                isIncome,
            });
        }

        return data;
    } else {
        for (let i = expenses.length - 1; i > 0; i--) {
            if (isAfter(new Date(expenses[i].date), new Date())) {
                continue;
            }

            const expense = expenses[i];
            const isIncome = incomeIds.includes(expense.subcategoryId);

            const y = tempAmount;
            tempAmount = isIncome
                ? tempAmount - expense.amount
                : tempAmount + expense.amount;

            const x = expense.timestamp;
            const date = expense.timestamp;

            data.push({
                balance: tempAmount,
                ...expense,
                x,
                y,
                date,
                isIncome,
            });
        }

        return data.reverse();
    }
};
export const calcProjection = (projectionData, lookAhead = 3, initBalance) => {
    // this calculates the projection of what if you keep pattern of current month
    let data = [];
    const thisMonthAndYearExpenses = projectionData.filter((data) => {
        const date = new Date(data.date);
        const currentDate = new Date().getTime();
        return (
            date.getMonth() === new Date(currentDate).getMonth() &&
            date.getFullYear() === new Date(currentDate).getFullYear()
        );
    });
    const lookaheadArray = new Array(lookAhead)
        .fill(null)
        .map((_, index) => {
            return thisMonthAndYearExpenses.map((expense) => {
                const date = new Date(expense.date);
                const newDate = new Date(date.getTime() + ONE_MONTH_MS * (1 + index)); // TODO: dynamic and through UI

                return {
                    ...expense,
                    date: newDate,
                };
            });
        })
        .flat();

    if (lookaheadArray.length === 0) return data;

    // let date = new Date(lookaheadArray[0].date);
    let tempAmount = initBalance;

    for (const expense of lookaheadArray) {
        const {amount, isIncome, categoryId, date} = expense;

        // Bi-monthly categories: 36,
        if (
            [36, 33, 34].includes(categoryId) &&
            new Date(date).getMonth() % 2 === 0
        ) {
            // the category is bi-monthly and the month is even
            continue;
        }

        tempAmount = isIncome ? tempAmount + amount : tempAmount - amount;
        data.push({
            y: tempAmount,
            x: date.getTime(),
            date: date,
            amount,
        });

        // date = new Date(date.getTime() + ONE_DAY_MS);
    }

    return data;
};
export const calcBudget = (budget, initAmount = 0, lookAhead = 3) => {
    let data = [];
    let tempAmount = initAmount;
    let date = new Date("11.01.2022");
    const budgetEntries = Object.entries(budget || {});
    const lookaheadBudgetEntries = new Array(lookAhead)
        .fill(null)
        .map(() => {
            return [...budgetEntries];
        })
        .flat();
    for (const [categoryId, amount] of lookaheadBudgetEntries) {
        tempAmount = IncomeIds.includes(String(categoryId))
            ? tempAmount + amount
            : tempAmount - amount;

        const category = Categories.filter((category) => {
            return category.subCategories.filter((sub) => {
                return String(sub.id) === String(categoryId);
            })[0];
        })[0];

        const name = category && category?.name;

        data.push({
            name,
            amount: amount,
            date,
            y: tempAmount,
            x: date.getTime(),
        });

        date = new Date(date.getTime() + ONE_DAY_MS);
    }

    return data;
};

export const useChart = ({
    expensesData,
    budget,
    balance,
    lookaheadInMonths,
    startDate,
    canvasRef,
    initialAmount
}) => {
    const budgetData = useMemo(() => {
        return calcBudget(budget, balance, lookaheadInMonths);
    }, [budget, balance, lookaheadInMonths]);

    // const projectionData = useMemo(() => {
    // 	return calcProjection(expensesData, initialAmount, lookaheadInMonths);
    // }, [expensesData]);

    useEffect(() => {
        if (!canvasRef.current || expensesData.length === 0) {
            return;
        }

        const projectionData = calcProjection(
            expensesData,
            4,
            expensesData[expensesData.length - 1]?.balance
        );
        const data = expensesData.filter((expense) => {
            if (expense.isRecurring) {
                return true;
            }

            return expense.date >= startDate;
        });

        chart = createNewChart({
            startDate,
            data,
            // budget: budgetData,
            // projectionData,
        });

        return () => {
            chart && chart.destroy();
            singleton = null;
        };
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        startDate,
        canvasRef,
        expensesData,
        budgetData,
        initialAmount,
        lookaheadInMonths,
    ]);
}