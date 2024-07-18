import {Button, Title} from "../../atoms";
import {Trans} from "@lingui/macro";
import {SheetUpload} from "../../organisms/SheetUpload";
import classNames from "classnames";
import {isExistingExpense} from "../../../utils/expenses";
import {Expense} from "../../../models";
import {Box} from "../../atoms/Box";
import {useState} from "react";
import {noop} from "lodash";

const formatAmount = (amount) => {
    return parseFloat(amount.replace("₪", "").replace(",", "").trim());
};

const getDateTimestamp = (date) => {
    const dateParts = date?.split("/");
    const year = dateParts && dateParts[2] ? `20${dateParts[2]}` : new Date().getFullYear();
    const month = dateParts && Number(dateParts[1]);
    const day = dateParts && Number(dateParts[0]);
    return new Date(Date.UTC(year, month - 1, day)).getTime();
};

export const ImportFromSheet = ({
                                    message = "",
                                    isStatusAnimated,
                                    expenses = [],
                                    setParsedExpenses = noop,
                                }) => {
    const [parsedFile, setParsedFile] = useState([]);

    return (
        <Box>
            <div>
                <Title type={Title.Types.H1} className="mb-4">
                    <Trans>Sheet</Trans>
                </Title>
                <SheetUpload onSheetParse={data => {
                    setParsedFile(data.map(row => ({
                        name: row["Name"] || row['שם'] || row['על מה?'],
                        timestamp: getDateTimestamp(row["Date"] || row['תאריך']),
                        amount: formatAmount(row["Amount"] || row['סכום'] || "0"),
                        categoryName: row["Category"] || row['קטגוריה'],
                    })));
                }}/>
            </div>

            <Button
                size={Button.Sizes.FULL}
                isDisabled={Boolean(parsedFile.length === 0)}
                className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                    "animate-pulse duration-500": isStatusAnimated,
                })}
                onClick={() => {
                    const newExpenses = parsedFile.map(item => {
                        const similarExpense = expenses.find(existingItem => {
                            return existingItem.name === item.name;
                        });

                        if (similarExpense?.categoryId) {
                            item.categoryId = similarExpense.categoryId;
                        }

                        return item;
                    });

                    setParsedExpenses(newExpenses
                        .filter(item => !isExistingExpense(item, expenses))
                        .map(item => new Expense(item)));
                }}>
                {isStatusAnimated ? message : <Trans>Parse File</Trans>}
            </Button>
        </Box>
    );
};
