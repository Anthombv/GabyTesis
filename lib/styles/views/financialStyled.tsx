type Props = {
  finan: string;
};

export const FinanField = (props: Props) => {
  let color = "white";

  switch (props.finan) {
    case "Aprobado":
      color = "rgb(193 243 190)";      
      break;
    case "Pendiente":
      color = "#ffdd9e";
      break;
  }

  return (
    <p
      // style={{
      //   backgroundColor: color,
      //   color: "#4a4a4a",
      //   fontSize: "10px",
      //   margin: 0
      // }}
      style={{
        backgroundColor: color,
        color: "#475569",
        //color: "#fffff",
        fontSize: "10px",
        margin: 1,
        borderRadius: "8px",
        fontWeight: "600"
      }}
    >
      {props.finan.toUpperCase()}
    </p>
  );
};
