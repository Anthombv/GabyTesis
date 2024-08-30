import { useEffect, useRef, useState } from "react";
import HttpClient from "../../lib/utils/http_client";
import { useAuth } from "../../lib/hooks/use_auth";
import Router from "next/router";
import { useWindowSize } from "../../lib/hooks/use_window_size";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../lib/components/loading_container";
import { Facture, Solicitude } from "../../lib/types";

const GeneralReportHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());

  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesByProject, setSolicitudesByProject] = useState<
    Map<String, Array<Facture>>
  >(new Map());

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let value = 0;
      let valueRetention = 0;
      let valueNet = 0;
      let discount = 0;
      let valueNomina = 0;

      const dateString = Router.query.dateString as string;

      //Solicitudes y anticipos sin terminar
      var solicitudesConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];
      solicitudesConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      //Solicitudes y anticipos del historial
      var solicitudesHisConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesHisConst150: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude/solicitudeHistory150-300?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisConst150.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      let concatConst = solicitudesHisConst.concat(
        solicitudesConst,
        solicitudesHisConst150
      );

      setSolicitudes(new Map([["const", concatConst]]));
      console.log(solicitudes);
      setValues(
        new Map([
          ["value", value],
          ["valueRetention", valueRetention],
          ["discount", discount],
          ["valueNet", valueNet],
          ["valueNomina", valueNomina],
        ])
      );

      let auxSolicitudesByProject: Map<String, Array<Facture>> = new Map();

      setSolicitudesByProject(auxSolicitudesByProject);
      console.log(solicitudesByProject);

      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = { maximumFractionDigits: 2 };

  const getSoliciter = (
    arraySolicitude: Array<Solicitude>,
    factureId: string | undefined
  ): string => {
    let solicitudeFound = (arraySolicitude ?? []).filter(
      (solicitude: Solicitude) =>
        solicitude.items.some((facture: Facture) => facture.id === factureId)
    );
    return solicitudeFound[0]?.soliciter ?? "";
  };

  const projectFacturesTotal = (
    factures: Array<Facture>,
    project: string
  ): JSX.Element => {
    let value = 0;
    let valueRetention = 0;
    let valueNet = 0;
    let discount = 0;
    factures.forEach((facture: Facture) => {
      value += facture.value;
      valueRetention += facture.valueRetention;
      valueNet += facture.valueNet;
      discount += facture.discount;
    });
    return (
      <>
        <th
          colSpan={7}
          style={{
            border: "1px solid",
            width: 400,
            textAlign: "center",
            backgroundColor: "#aed6f1",
          }}
        >
          TOTAL {project}
        </th>
        <th
          style={{
            border: "1px solid",
            width: 150,
            backgroundColor: "#aed6f1",
          }}
        >
          ${(value ?? "").toLocaleString("en-US", options)}
        </th>
        <th
          style={{ border: "1px solid", width: 80, backgroundColor: "#aed6f1" }}
        >
          ${(valueRetention ?? "").toLocaleString("en-US", options)}
        </th>
        <th
          style={{ border: "1px solid", width: 80, backgroundColor: "#aed6f1" }}
        >
          ${(discount ?? "").toLocaleString("en-US", options)}
        </th>
        <th
          style={{
            border: "1px solid",
            width: 120,
            backgroundColor: "#aed6f1",
          }}
        >
          ${(valueNet ?? "").toLocaleString("en-US", options)}
        </th>
      </>
    );
  };

  const getSolicitudesByProjects = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      console.log(arrayByProject);
      console.log(arrayByProject);
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((itemIgFac: Facture, factureIg: number) => {
              return (
                <tr
                  style={{
                    border: "1px solid",
                    fontSize: "11px",
                    textAlign: "center",
                  }}
                  key={factureIg}
                >
                  <td style={{ border: "1px solid", width: 250 }}>
                    {getSoliciter(arraySolicitude, itemIgFac.id)}
                  </td>

                  <td style={{ border: "1px solid", width: 200 }}>
                    {itemIgFac.provider.name ?? ""}
                  </td>
                  <td style={{ border: "1px solid", width: 90 }}>
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td style={{ border: "1px solid ", width: 90 }}>
                    {itemIgFac.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 400,
                      textAlign: "left",
                    }}
                  >
                    {itemIgFac.details ?? ""}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {(itemIgFac.value ?? "").toLocaleString("en-US", options)}
                  </td>
                  <td style={{ border: "1px solid", width: 80 }}>
                    {(itemIgFac.valueRetention ?? "").toLocaleString(
                      "en-US",
                      options
                    )}
                  </td>
                  <td style={{ border: "1px solid", width: 80 }}>
                    {(itemIgFac.discount ?? "").toLocaleString(
                      "en-US",
                      options
                    )}
                  </td>
                  <td style={{ border: "1px solid", width: 120 }}>
                    {(itemIgFac.valueNet ?? "").toLocaleString(
                      "en-US",
                      options
                    )}
                  </td>
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              {projectFacturesTotal(factures, project)}
            </tr>
          </tbody>
          <br />
        </>
      );
    });
    return jsxArray;
  };

  const fecha = Router.query.dateString;

  solicitudes.forEach((value, key) => {
    console.log(`Clave: ${key}`);
    console.log("Valores:", value);
  });

  return (
    <>
      <title>Reporte General</title>

      <LoadingContainer visible={!loading}>
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
            className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-red-500 hover:border-transparent rounded"
            onClick={() => window.print()}
          >
            Imprimir
          </button>

          <button
            className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-gray-500 hover:border-transparent rounded"
            onClick={() => Router.back()}
          >
            Volver
          </button>
        </div>
        <div
          style={{
            margin: "1em",
            background: "white",
          }}
        >
          <h4 className="text-center mb-3 fw-bold">
            REPORTE GERENCIAL {fecha}
          </h4>

          <h5 className="text-center my-3 fw-bold">SOLICITUDES DE PAGO A PROVEEDORES</h5>

          <table style={{ width: "100%" }}>
            <thead>
              <tr
                style={{
                  border: "1px solid",
                  fontSize: "11px",
                  textAlign: "center",
                  background: "#8c4343",
                }}
              >
                <th>Solicitante</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th># Factura</th>
                <th>Detalle</th>
                <th>Valor</th>
                <th>Retencion</th>
                <th>Descuento</th>
                <th>Pagado</th>
              </tr>
              <tr>
                <td style={{ border: "1px solid" }}>conta</td>
                <td style={{ border: "1px solid" }}>GABRIELA TORRES</td>
                <td style={{ border: "1px solid" }}>2024-10-10</td>
                <td style={{ border: "1px solid" }}>123</td>
                <td style={{ border: "1px solid" }}>
                  Pago por servicios profesionales
                </td>
                <td style={{ border: "1px solid" }}>500</td>
                <td style={{ border: "1px solid" }}>10</td>
                <td style={{ border: "1px solid" }}>10</td>
                <td style={{ border: "1px solid" }}>Aprobado</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid" }}>conta</td>
                <td style={{ border: "1px solid" }}>ALEXANDRA PEREZ</td>
                <td style={{ border: "1px solid" }}>2024-10-10</td>
                <td style={{ border: "1px solid" }}>65879</td>
                <td style={{ border: "1px solid" }}>asd</td>
                <td style={{ border: "1px solid" }}>600</td>
                <td style={{ border: "1px solid" }}>25</td>
                <td style={{ border: "1px solid" }}>0</td>
                <td style={{ border: "1px solid" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid" }}>conta</td>
                <td style={{ border: "1px solid" }}>LAGANGA</td>
                <td style={{ border: "1px solid" }}>2024-07-17</td>
                <td style={{ border: "1px solid" }}>4569871</td>
                <td style={{ border: "1px solid" }}>Pago Camaras</td>
                <td style={{ border: "1px solid" }}>520</td>
                <td style={{ border: "1px solid" }}>25</td>
                <td style={{ border: "1px solid" }}>0</td>
                <td style={{ border: "1px solid" }}>Aprobado</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid" }}>admin</td>
                <td style={{ border: "1px solid" }}>MARIA BELEN MORA</td>
                <td style={{ border: "1px solid" }}>2024-02-10</td>
                <td style={{ border: "1px solid" }}>65478</td>
                <td style={{ border: "1px solid" }}>Pago tesis</td>
                <td style={{ border: "1px solid" }}>500</td>
                <td style={{ border: "1px solid" }}>10</td>
                <td style={{ border: "1px solid" }}>0</td>
                <td style={{ border: "1px solid" }}></td>
              </tr>

              <tr>
                <td style={{ border: "1px solid" }}>admin</td>
                <td style={{ border: "1px solid" }}>MARIA BELEN MORA</td>
                <td style={{ border: "1px solid" }}>2024-02-10</td>
                <td style={{ border: "1px solid" }}>65478</td>
                <td style={{ border: "1px solid" }}>Pago tesis</td>
                <td style={{ border: "1px solid" }}>500</td>
                <td style={{ border: "1px solid" }}>10</td>
                <td style={{ border: "1px solid" }}>0</td>
                <td style={{ border: "1px solid" }}></td>
              </tr>
            </thead>
          </table>

          <div id="const">
            <table style={{ width: "100%" }}>
              {getSolicitudesByProjects(
                solicitudes.get("const"),
                solicitudesByProject
              )}
            </table>
          </div>

          <br />
          <table border={1} width="100%">
            <thead>
              <tr
                style={{
                  border: "1px solid white",
                  fontSize: "11px",
                  textAlign: "center",
                  background: "#8c4343",
                }}
              >
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th style={{ backgroundColor: "white" }}></th>
                <th
                  style={{
                    backgroundColor: "#aed6f1",
                    border: "1px solid black",
                  }}
                >
                  VALOR SOLICITADO
                </th>
                <th
                  style={{
                    backgroundColor: "#aed6f1",
                    border: "1px solid black",
                  }}
                >
                  VALOR RETENIDO
                </th>
                <th
                  style={{
                    backgroundColor: "#aed6f1",
                    border: "1px solid black",
                  }}
                >
                  VALOR DESCONTADO
                </th>
                <th
                  style={{
                    backgroundColor: "#28b463",
                    border: "1px solid black",
                  }}
                >
                  VALOR A PAGAR
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{
                  border: "1px solid",
                  fontSize: "11px",
                  textAlign: "center",
                  backgroundColor: "#aed6f1",
                }}
              >
                <th
                  colSpan={7}
                  style={{
                    border: "1px solid",
                    width: 400,
                    textAlign: "center",
                  }}
                >
                  TOTAL SOLICITUDES
                </th>
                <th style={{ border: "1px solid" }}>
                  ${(values.get("value") ?? "").toLocaleString()}
                </th>
                <th style={{ border: "1px solid", width: 80 }}>
                  ${(values.get("valueRetention") ?? "").toLocaleString()}
                </th>
                <th style={{ border: "1px solid", width: 80 }}>
                  ${(values.get("discount") ?? "").toLocaleString()}
                </th>
                <th style={{ border: "1px solid", width: 120 }}>
                  ${(values.get("valueNet") ?? "").toLocaleString()}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingContainer>
    </>
  );
};
export default GeneralReportHistory;
