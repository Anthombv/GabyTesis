/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import theme from "../../../lib/styles/theme";
import { ResponseData, Solicitude } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitude, setSolicitude] = useState<Solicitude>(null);
  const componentRef = useRef(null);

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
      setSolicitude(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesColumns: Array<string> = [
    "Proyecto",
    "Centro costos",
    "Proveedor",
    "# Factura",
    "Detalle",
    "Obervacion",
    "Documento",
    "Beneficiario",
    "# Cuenta",
    "Valor",
  ];

  return (
    <>
      <title>Reporte de solicitud</title>
      <LoadingContainer visible={loading}>
        {solicitude === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div className="bg-white min-h-screen flex">
            <div
              style={{
                width: "297mm",
                position: "relative",
                margin: "0 auto",
                marginBottom: "5%",
              }}
            >
              <style>
                {`
                  body {
                    background-color: white !important;
                  }
                  @media print {
                    .clase-a-ocultar {
                      display: none !important;
                    }
                  }
                `}
              </style>
              <div className="grid grid-cols-0 md:grid-cols-3 m-4 gap-4 mb-4 clase-a-ocultar">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-red-500 hover:border-transparent rounded-full text-sm"
                  onClick={() => window.print()}
                >
                  Imprimir
                </button>

                <button
                  className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
              <div ref={componentRef}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <table width="100%">
                  <tr>
                    <td width={"50%"}>
                      <h6
                        className="mx-4"
                        style={{
                          background: theme.colors.red,
                          padding: "20px 35px 20px 35px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        DETALLE DE PAGOS SOLICITADOS
                      </h6>
                    </td>
                    <td width={"50%"} className="text-center">
                      <img
                        src="/logo_horizontal.png"
                        alt="logo"
                        style={{
                          width: "300px",
                          height: "60px",
                        }}
                      />
                    </td>
                  </tr>
                </table>
                <h4 className="text-center my-3">
                  COMERCIAL TORRES SOLICITUD N°{" "}
                  <strong>{solicitude.number}</strong>
                </h4>
                <table
                  style={{ fontSize: "12px", textAlign: "center" }}
                  className="mb-3"
                  width="95%"
                  align="center"
                  border={2}
                >
                  <tr>
                    <td style={{ width: "13%" }}>
                      <p>
                        <strong>SOLICITANTE: </strong>
                        {solicitude.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p>
                        <strong>ESTADO: </strong>
                        {solicitude.soliciterState}{" "}
                        {solicitude.applicantDate.split("  ")[0] ?? ""}
                      </p>
                    </td>
                    <td style={{ width: "12%" }}>
                      <p>
                        <strong>FECHA DE SOLICITUD: </strong>
                        {solicitude.date.split("  ")[0]}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>
                      <p>
                        <strong>DETALLE GENERAL: </strong>
                        {solicitude.details}
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  width={"100%"}
                  align="center"
                  style={{ fontSize: "11px" }}
                  border={1}
                  className="table table-striped"
                >
                  <thead>
                    <tr>
                      {facturesColumns.map((item, index) => (
                        <th
                          className="p-1"
                          style={{
                            textAlign: "center",
                            backgroundColor: "#8c130f",
                            color: "white",
                            border: "1px solid black",
                          }}
                          key={index}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {solicitude.items.map((item, index) => (
                        <>
                          <tr
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                            key={index}
                          >
                           
                            
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 150,
                              }}
                            >
                              {item.provider?.name ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 60,
                              }}
                            >
                              {item.factureNumber ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 300,
                                textAlign: "left",
                              }}
                            >
                              {item.details ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 200,
                                textAlign: "left",
                              }}
                            >
                              {item.observation ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 90,
                              }}
                            >
                              {item.documentDelivered ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 120,
                              }}
                            >
                              {item.beneficiary ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 60,
                              }}
                            >
                              {item.accountBank ?? ""}
                            </td>
                            <td
                              className="p-0"
                              style={{
                                border: "1px solid black",
                                width: 50,
                              }}
                            >
                              {(item.value ?? "").toLocaleString("en-US")}
                            </td>
                          </tr>
                        </>
                      ))}
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                        colSpan={9}
                      >
                        TOTAL
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {solicitude.items
                          .reduce(
                            (partialSum, facture) => partialSum + facture.value,
                            0
                          )
                          .toLocaleString("en-US")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
            </div>
          </div>
        )}
      </LoadingContainer>
    </>
  );
};

export default PrintSolicitude;
