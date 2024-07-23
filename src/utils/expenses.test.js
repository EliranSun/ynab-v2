import {computeNoSubcategoriesExpenses} from "./expenses";

describe("computeNoSubcategoriesExpenses", () => {
    it("Should return an empty object if there are no expenses", () => {
        const categories = [];
        const expenses = [];

        const result = computeNoSubcategoriesExpenses(categories, expenses);

        expect(result).toEqual({});
    });

    it("Should return an empty object if there are no categories", () => {
        const categories = [];
        const expenses = [
            {
                subcategoryId: 1,
            }
        ];

        const result = computeNoSubcategoriesExpenses(categories, expenses);

        expect(result).toEqual({});
    });

    it("Should return an object with the subcategory that was not found", () => {
        const categories = [
            {
                id: 1,
                subcategories: [
                    {
                        id: 1,
                    }
                ]
            }
        ];
        const expenses = [
            {
                subcategoryId: 2,
            }
        ];

        const result = computeNoSubcategoriesExpenses(categories, expenses);

        expect(result).toEqual({
            2: {
                currentId: 2,
                icon: undefined,
                name: undefined,
                newId: undefined,
            }
        });
    });
});