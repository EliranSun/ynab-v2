import { Title } from "../../../atoms";

// ₪
const TransactionAmount = ({ amount }) => {
  return (
    <Title type={Title.Types.H2}>
      <b>
        {amount?.toFixed(2)} ILS
      </b>
    </Title>
  );
};

export default TransactionAmount;
