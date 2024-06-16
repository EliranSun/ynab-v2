import {ExpensesContext} from "../../context";
import {useContext, useMemo, useState} from "react";
import {differenceInDays, subDays} from "date-fns";
import {formatCurrency} from "../../utils";

export const LastExpenses = () => {
    const [days, setDays] = useState(7);
    const {expensesArray} = useContext(ExpensesContext);
    const lastItems = useMemo(() => {
        const filtered = expensesArray.filter(item => {
            const diff = differenceInDays(new Date(), item.timestamp);
            return diff < days && diff > 0;
        });
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }, [expensesArray, days]);

    const totalAmount = useMemo(() => lastItems.reduce((acc, item) => acc + item.amount, 0), [lastItems]);

    return (
        <section className="m-4 w-1/2 h-[66vh] overflow-y-auto bg-white border-8 border-gray-500 shadow p-4">
            <div className="p-2">
                <input
                    type="date"
                    placeholder="Start Date"
                    defaultValue={subDays(new Date(), days).toISOString().split('T')[0]}
                    onChange={e => setDays(differenceInDays(new Date(), new Date(e.target.value)))}
                    className="border-2 border-gray-500 p-2"/>
                <input
                    type="date"
                    placeholder="End Date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    onChange={e => setDays(differenceInDays(new Date(e.target.value), new Date()))}
                    className="border-2 border-gray-500 p-2"/>
            </div>
            <h1 className="text-3xl font-mono">Over {days} days I spent</h1>
            <h2 className="text-7xl font-mono">{formatCurrency(totalAmount, false, false)}</h2>
            {lastItems.map(item => {
                return (
                    <div key={item.id} className="flex justify-between items-center p-2 border-b border-gray-500">
                        <div>
                            <h2 className="text-2xl font-mono">{item.name}</h2>
                            <p className="text-lg font-mono">{item.note}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-mono">{formatCurrency(item.amount, false, false)}</p>
                            <p className="text-lg font-mono">{differenceInDays(new Date(), item.timestamp)} days ago</p>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}