import { Title } from "../../../atoms";
import { useEffect, useState } from "react";
// import translate from "translate";

const TranslatedExpenseName = ({ name }) => {
  const [isOriginalView, setIsOriginalView] = useState(true);
  const [translatedName, setTranslatedName] = useState(name);
  
  // useEffect(() => {
  //   (async () => {
  //     const translation = await translate(name, {
  //       from: 'he',
  //       to: 'en',
  //     });
  //     console.log("translation", translation);
  //     setTranslatedName(translation);
  //   })();
  // }, [name]);
  
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
    