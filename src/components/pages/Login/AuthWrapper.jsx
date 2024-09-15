import { Spinner } from "@phosphor-icons/react";
import { useContext } from "react";
import { UserContext } from "../../../context";
import { LoginWelcomeMessage } from "../../atoms/LoginWelcomeMessage";

const AuthWrapper = ({ children }) => {
	const { user } = useContext(UserContext);

	if (user === false) {
		return (
			<div className="flex w-screen h-screen flex-col items-center justify-center gap-8 text-center px-8">
				<Spinner className="animate-spin" />
			</div>
		);
	}

	if (user && user.id) {
		return children;
	}

	return <LoginWelcomeMessage />;
};

export default AuthWrapper;
