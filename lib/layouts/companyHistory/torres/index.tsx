import React, { useState } from "react";
import Solicitude1a150 from "../../../components/companyHistory/IC/solicitude1-150";
import Solicitude151al300 from "../../../components/companyHistory/IC/solicitude151-300";

type Props = {
  dates: Array<string>;
};

// Inicio de la app
const SolicitudeICHistoryPanel = (props: Props) => {
  const [selectedComponent, setSelectedComponent] = useState<
    "1-150" | "151-300"
  >("1-150");

  const handleComponentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedComponent(event.target.value as "1-150" | "151-300");
  };

  return (
    <>
      <strong>Buscar Solicitudes :{" "} </strong>
      <select
        value={selectedComponent}
        onChange={handleComponentChange}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
          backgroundColor: "#fff",
          marginTop: "2em",
        }}
      >
        <option value="1-150">desde 1 - hasta 150</option>
        <option value="151-300">desde 151 - hasta 300</option>
      </select>

      {selectedComponent === "1-150" && <Solicitude1a150 dates={[]} />}
      {selectedComponent === "151-300" && <Solicitude151al300 dates={[]} />}
    </>
  );
};

export default SolicitudeICHistoryPanel;

