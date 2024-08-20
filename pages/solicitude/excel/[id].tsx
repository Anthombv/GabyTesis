/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import { useEffect, useState } from "react";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import theme from "../../../lib/styles/theme";
import { ResponseData, Solicitude } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const ExcelSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitude, setSolicitude] = useState<Solicitude>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      setSolicitude(response.data ?? []);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportToExcel() {
    let table = document.getElementById("mi-tabla");
    let html = table.outerHTML;
    let url =
      "data:application/vnd.ms-excel;charset=ISO-8859-1," + escape(html);
    let downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = "Solicitud-IC.xls";
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <>
      <title>IC | Excel Solicitud</title>
      <LoadingContainer visible={loading}>
        {solicitude === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div>
            <div className="grid grid-cols-2 w-2/4 mx-auto m-4 mb-4">
              <div>
                <button
                  className="text-center bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-green-500 hover:border-transparent rounded"
                  onClick={exportToExcel}
                >
                  Excel
                </button>
              </div>
              <div>
                <button
                  className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-gray-500 hover:border-transparent rounded"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
            </div>
            <table className="mt-5 w-full">
              <thead>
                <tr>
                  <td>
                    <div style={{ paddingLeft: "10%" }}>
                      <h3
                        style={{
                          background: theme.colors.red,
                        }}
                        className="p-5 text-white text-center text-lg"
                      >
                        DETALLE DE PAGOS SOLICITADOS
                      </h3>
                    </div>
                  </td>
                  <td>
                    <img
                      src="/logo_horizontal.png"
                      alt="logo"
                      style={{
                        width: "300px",
                        height: "60px",
                        marginLeft: "10em",
                        marginBottom: "30px",
                      }}
                    />
                  </td>
                </tr>
              </thead>
            </table>
            <h3 className="text-center mb-3 text-2xl">
              SOLICITUD N° <strong>{solicitude.number}</strong>
            </h3>

            <table width="95%" align="center" className="text-base">
              <thead>
                <tr>
                  <td style={{ width: "40%" }}>
                    <strong>SOLICITANTE: </strong>
                    {solicitude.soliciter}
                  </td>
                  <td style={{ width: "40%" }}>
                    <strong>ESTADO: </strong>
                    {solicitude.soliciterState}:{" "}
                    {solicitude.applicantDate.split("  ")[0] ?? ""}
                  </td>
                  <td>
                    <strong>Diferencia: </strong>$
                    {solicitude.items
                      .reduce(
                        (partialSum, facture) =>
                          partialSum + facture.difference,
                        0
                      )
                      .toLocaleString("en-US")}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "20%" }}>
                    <strong>FECHA DE SOLICITUD: </strong>
                    {solicitude.date.split("  ")[0]}
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "20%" }}>
                    <strong>DETALLE GENERAL: </strong>
                    {solicitude.details}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <table
                id="mi-tabla"
                align="center"
                className="text-sm w-11/12 border border-black"
              >
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th className="border border-black">Proyecto</th>
                    <th className="border border-black">Centro Costos</th>
                    <th className="border border-black">Proveedor</th>
                    <th className="border border-black">Fecha Factura</th>
                    <th className="border border-black"># Factura</th>
                    <th className="border border-black">Detalle</th>
                    <th className="border border-black">Beneficiario</th>
                    <th className="border border-black">Cédula</th>
                    <th className="border border-black">Banco Beneficiario</th>
                    <th className="border border-black"># Cuenta</th>
                    <th className="border border-black">Valor</th>
                    <th className="border border-black">Valor Retenido</th>
                    <th className="border border-black">Valor Pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitude.items.map((item, index) => (
                    <tr style={{ textAlign: "center" }} key={index}>
                      
                      
                      <td className="border border-black">
                        {item.provider?.name ?? ""}
                      </td>
                      <td className="border border-black">
                        {item.factureDate ?? ""}
                      </td>
                      <td className="border border-black">
                        {item.factureNumber ?? ""}
                      </td>
                      <td className="border border-black">
                        {item.details ?? ""}
                      </td>
                      <td className="border border-black">
                        {item.beneficiary ?? ""}
                      </td>
                      <td className="border border-black">
                        {item.identificationCard ?? ""}
                      </td>
                      <td className="border border-black">{item.bank ?? ""}</td>
                      <td className="border border-black">
                        {item.accountBank ?? ""}
                      </td>
                      <td className="border border-black">
                        {(item.value ?? 0).toLocaleString("en-US")}
                      </td>
                      <td className="border border-black">
                        {(item.valueRetention ?? 0).toLocaleString("en-US")}
                      </td>
                      <td className="border border-black">
                        {(item.valueNet ?? 0).toLocaleString("en-US")}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ textAlign: "center" }}>
                    <th colSpan={10}>Total:</th>
                    <td className="border border-black">
                      {solicitude.items
                        .reduce((total, item) => total + item.value, 0)
                        .toLocaleString("en-US")}
                    </td>
                    <td className="border border-black">
                      {solicitude.items
                        .reduce((total, item) => total + item.valueRetention, 0)
                        .toLocaleString("en-US")}
                    </td>
                    <td className="border border-black">
                      {solicitude.items
                        .reduce((total, item) => total + item.valueNet, 0)
                        .toLocaleString("en-US")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </LoadingContainer>
    </>
  );
};

export default ExcelSolicitude;
