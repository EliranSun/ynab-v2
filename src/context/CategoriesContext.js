import {
	createContext,
	useContext,
	useEffect,
	useCallback,
	useState,
} from "react";
import { getCategories } from "../utils/db";
import { noop, orderBy } from "lodash";
import { UserContext } from "./UserContext";
import { Trans } from "@lingui/macro";
import { Button } from "../components";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Routes } from "../constants/route";

export const CategoriesContext = createContext({
	categories: [],
	fetch: noop,
});

export const CategoriesProvider = ({ children }) => {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const [categories, setCategories] = useState([]);
	const [walkthroughViewStep, setWalkthroughViewStep] = useState(0);
	const currentRoute = window.location.pathname;

	const fetch = useCallback(() => {
		getCategories(user.id).then((newCategories) => {
			console.log({ newCategories });
			if (!newCategories || !newCategories.length) {
				setWalkthroughViewStep(1);
				return;
			}

			const atLeastOneHasSubcategories = newCategories.some((category) => {
				return category.subcategories.length > 0;
			});

			if (!atLeastOneHasSubcategories) {
				setWalkthroughViewStep(2);
			}

			setCategories(orderBy(newCategories, ["id"], ["asc"]));
		});
	}, [user]);

	useEffect(() => {
		if ((!user || !user.id) && process.env.NODE_ENV !== "development") {
			return;
		}

		fetch();
	}, [user]);

	if (walkthroughViewStep > 0 && currentRoute !== Routes.CATEGORIES) {
		return (
			<div
				className={classNames({
					"max-w-screen-lg fixed h-1/2 w-2/3 inset-0 m-auto backdrop-blur bg-white/20": true,
					"flex flex-col justify-center items-center rounded-3xl": true,
					"text-xl p-4 shadow-lg text-right": true,
				})}>
				<p className="mb-16">
					{walkthroughViewStep === 1 ? (
						<>
							<Trans>Hey</Trans>, {user.displayName}
							<br />
							<Trans>Just wanted to say, welcome!</Trans>
							<br />
							<br />
							<Trans>
								In order to use the app, you have got to set up categories.
							</Trans>
							.<br />
							<Trans>
								Categories are your way to make order, out of the chaos.
							</Trans>
							.<br />
							<Trans>Let us take you there</Trans>.<br />
						</>
					) : null}
					{walkthroughViewStep === 2 ? (
						<>
							<Trans>Hey</Trans>, {user.displayName}
							<br />
							<Trans>It is us again</Trans>
							<br />
							<br />
							<Trans>You have completed entering categories</Trans>.<br />
							<Trans>Now you must add subcategories</Trans>.<br />
							<Trans>You will associate these with each entry you add</Trans>.
							<br />
						</>
					) : null}
				</p>
				<Button onClick={() => navigate(Routes.CATEGORIES)}>
					<Trans>OK</Trans>
				</Button>
			</div>
		);
	}

	return (
		<CategoriesContext.Provider value={{ categories, fetch }}>
			{children}
		</CategoriesContext.Provider>
	);
};
