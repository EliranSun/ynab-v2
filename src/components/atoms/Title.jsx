import classNames from "classnames";

const Types = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
};

const Title = ({ children, type, className, transId, ...rest }) => {
  switch (type) {
    default:
    case Types.H1:
      return (
        <h1 className={classNames("text-5xl md:text-5xl font-bold", className)} {...rest}>
          {children}
        </h1>
      );
    case Types.H2:
      return (
        <h2 className={classNames("text-4xl", className)}>
          {children}
        </h2>
      );
    case Types.H3:
      return <h3 className={classNames("text-3xl", className)}>{children}</h3>;
    case Types.H4:
      return <h4 className={classNames("text-2xl", className)}>{children}</h4>;
    case Types.H5:
      return <h5 className={classNames("text-xl", className)}>{children}</h5>;
    case Types.H6:
      return <h6 className={classNames("text-lg", className)}>{children}</h6>;
  }
};

Title.Types = Types;

export default Title;