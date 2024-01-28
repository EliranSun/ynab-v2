import {useState} from "react";
import {useDate} from "../../molecules";
import {Title} from "../../atoms";
import {CategoryBalance} from "./CategoryBalance";
import {BalanceSummary} from "../../molecules/PastTwelveMonthsBalance/BalanceSummary";
import {Trans} from "@lingui/macro";
import {useCategories} from "../../../hooks/useCategories";
import {formatCurrency} from "../../../utils";


const BalanceView = () => {
        const {currentTimestamp, NextButton, PreviousButton, isSameDate, isPreviousMonth} = useDate();
        const categories = useCategories(currentTimestamp);

        return (
            <section className="md:h-screen overflow-y-auto overflow-x-hidden w-full p-4">
                {/*<Title className="mb-8"><Trans>Where'd the money go?</Trans></Title>*/}
                {/*<BalanceSummary timestamp={currentTimestamp}/>*/}
                <div className="flex flex-col md:flex-row items-start my-2 md:top-0">
                    <div
                        className="flex gap-2 md:my-0 items-center w-full justify-between md:justify-evenly bg-white p-0 z-10 max-w-2xl">
                        <PreviousButton/>
                        <Title type={Title.Types.H3} className="font-sans font-black">
                            {new Date(currentTimestamp).toLocaleString("en-GB", {
                                month: "short",
                                year: "2-digit",
                            })}
                        </Title>
                        <NextButton/>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 my-4">
                    {categories.summary.map((category) => {
                        return (
                            <CategoryBalance
                                key={category.id}
                                categoryId={category.id}
                                categoryName={category.name}
                                currentTimestamp={currentTimestamp}
                                isSameDate={isSameDate}
                                isPreviousMonth={isPreviousMonth}/>
                        );
                    })}
                    <div className="flex items-center w-full justify-center gap-4">
                        <div className="text-lg text-center text-green-500">
                            {formatCurrency(categories.totalIncome)}
                        </div>
                        <div className="text-lg text-center text-red-500">
                            {formatCurrency(-categories.totalExpenses)}
                        </div>
                        =
                        <Title type={Title.Types.H3} className="text-center font-black">
                            {formatCurrency(categories.totalIncome - categories.totalExpenses)}
                        </Title>
                    </div>
                </div>
            </section>
        );
    }
;

export default BalanceView;
