import { Title } from "../../../atoms";

const TransactionDate = ({ timestamp }) => {
  return (
    <Title type={Title.Types.H2}>
      <b>
        {new Date(timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
    </Title>
  );
};

export default TransactionDate;
