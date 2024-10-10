import { HalfYearBalanceSummary } from "../../molecules/HalfYearBalanceSummary";
import { useDate } from "../../molecules";

export const PastMonthsSummary = () => {
    const { currentTimestamp } = useDate();

    return <HalfYearBalanceSummary currentTimestamp={currentTimestamp}/>
}