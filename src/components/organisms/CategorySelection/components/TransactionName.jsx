import { Title } from "../../../atoms";
import { useState } from "react";

const TranslatedExpenseName = ({ name }) => {
  const [isOriginalView, setIsOriginalView] = useState(true);
  const [translatedName] = useState(name);

  return (
    <b
      onMouseEnter={() => setIsOriginalView(true)}
      onMouseLeave={() => setIsOriginalView(false)}>
      {isOriginalView ? name : translatedName}
    </b>
  );
}

const TransactionName = ({ name }) => {
  return (
    <Title dir="">
      <TranslatedExpenseName name={name}/>
    </Title>
  );
};

export default TransactionName;
    