import { useState } from "react";
import TransactionsLayoutButtons from "./TransactionsLayoutButtons";
import TransactionsPopover from "./TransactionsPopover";

const TransactionsSection = ({ data = [], selectedExpenseId, setSelectedExpenseId }) => {
    const [isTransactionsPopoverOpen, setIsTransactionsPopoverOpen] = useState(false);
    const [isTransactionsPopoverFullView, setIsTransactionsPopoverFullView] = useState(false);

    return (
        <>
            <TransactionsLayoutButtons
                isToggled={isTransactionsPopoverOpen}
                onExpandClick={() => setIsTransactionsPopoverFullView(!isTransactionsPopoverFullView)}
                onToggleClick={() => setIsTransactionsPopoverOpen(!isTransactionsPopoverOpen)}/>
            {isTransactionsPopoverOpen &&
                <TransactionsPopover
                    data={data}
                    selectedExpenseId={selectedExpenseId}
                    setSelectedExpenseId={setSelectedExpenseId}
                    isFullView={isTransactionsPopoverFullView}/>}
        </>
    );
};

export default TransactionsSection;