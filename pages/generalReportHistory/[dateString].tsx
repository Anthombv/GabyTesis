import { useEffect, useRef, useState } from "react";
import HttpClient from "../../lib/utils/http_client";
import { useAuth } from "../../lib/hooks/use_auth";
import Router from "next/router";
import { useWindowSize } from "../../lib/hooks/use_window_size";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../lib/components/loading_container";
import { Facture, FactureEmployees, Nomina, Solicitude } from "../../lib/types";

const GeneralReportHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());
  const [nomina, setNomina] = useState<Map<string, Array<Nomina>>>(new Map());
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesByProject, setSolicitudesByProject] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProject, setAdvancesByProject] = useState<
    Map<String, Array<Facture>>
  >(new Map());

  const windowSize = useWindowSize();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let value = 0;
      let valueRetention = 0;
      let valueNet = 0;
      let discount = 0;
      let valueNomina = 0;
      let advanceValue = 0;
      let advanceValueRetention = 0;
      let advanceValueNet = 0;
      let advanceDiscount = 0;

      const dateString = Router.query.dateString as string;
      var nomina: Array<Nomina> =
        (
          await HttpClient(
            "/api/nomina?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      nomina.forEach((nomina: Nomina) => {
        nomina.items.forEach((facture: FactureEmployees) => {
          const valueWithComma = facture.value.replace(",", ".");
          valueNomina += parseFloat(valueWithComma);
        });
      });

      var nominaHistory: Array<Nomina> =
        (
          await HttpClient(
            "/api/nomina/nominaHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      nominaHistory.forEach((nomina: Nomina) => {
        nomina.items.forEach((facture: FactureEmployees) => {
          valueNomina += parseFloat(facture.value);
        });
      });

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

      var solicitudesIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeInmogestion?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeCalderon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeBalcon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeRecaudaciones?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var advancesConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advance?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceInmogestion?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceCalderon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceValueNet += facture.valueNet;
          advanceDiscount += facture.discount;
        });
      });

      var advancesBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceBalcon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceRecaudaciones?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
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

      var solicitudesHisIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeInmogestion/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeCalderon/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeBalcon/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeRecaudaciones/solicitudeHistory?dates=" +
              dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var advancesHisConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advance/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceInmogestion/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceCalderon/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceBalcon/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisRecaudaciones =
        (
          await HttpClient(
            "/api/advanceRecaudaciones/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      let concatConst = solicitudesHisConst.concat(
        solicitudesConst,
        solicitudesHisConst150
      );
      let concatIg = solicitudesHisIg.concat(solicitudesIg);
      let concatCalderon = solicitudesHisCalderon.concat(solicitudesCalderon);
      let concatBalcon = solicitudesHisBalcon.concat(solicitudesBalcon);
      let concatRecaudaciones = solicitudesHisRecaudaciones.concat(
        solicitudesRecaudaciones
      );
      let concatAdvConst = advancesHisConst.concat(advancesConst);
      let concatAdvIg = advancesHisIg.concat(advancesIg);
      let concatAdvCalderon = advancesHisCalderon.concat(advancesCalderon);
      let concatAdvBalcon = advancesHisBalcon.concat(advancesBalcon);
      let concatAdvRecaudaciones = advancesHisRecaudaciones.concat(
        advancesRecaudaciones
      );
      let concatNomina = nominaHistory.concat(nomina);

      setSolicitudes(
        new Map([
          ["const", concatConst],
          ["ig", concatIg],
          ["calderon", concatCalderon],
          ["balcon", concatBalcon],
          ["recaudaciones", concatRecaudaciones],

          ["adv-const", concatAdvConst],
          ["adv-ig", concatAdvIg],
          ["adv-calderon", concatAdvCalderon],
          ["adv-balcon", concatAdvBalcon],
          ["adv-recaudaciones", concatAdvRecaudaciones],
        ])
      );
      setNomina(new Map([["nomina", concatNomina]]));

      setValues(
        new Map([
          ["value", value],
          ["valueRetention", valueRetention],
          ["discount", discount],
          ["valueNet", valueNet],
          ["valueNomina", valueNomina],

          ["adv-value", advanceValue],
          ["adv-valueRetention", advanceValueRetention],
          ["adv-discount", advanceDiscount],
          ["adv-valueNet", advanceValueNet],
        ])
      );

      let auxSolicitudesByProject: Map<String, Array<Facture>> = new Map();
      concatConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProject.keys()).includes(
              facture.project?.name
            )
          ) {
            auxSolicitudesByProject.set(facture.project?.name, [facture]);
          } else {
            auxSolicitudesByProject.set(facture.project?.name, [
              ...auxSolicitudesByProject.get(facture.project?.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProject(auxSolicitudesByProject);

      let auxAdvancesByProject: Map<String, Array<Facture>> = new Map();
      concatAdvConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProject.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProject.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProject.set(facture.project.name, [
              ...auxAdvancesByProject.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesByProject(auxAdvancesByProject);

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
                  <td style={{ border: "1px solid", width: 150 }}>
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
          <br /> {/* TODO check */}
        </>
      );
    });
    return jsxArray;
  };

  const getCenterCost = (facture: Facture, project: string): string => {
    switch (project) {
      default:
        return "";
    }
  };

  const getProvider = (facture: Facture, project: string): string => {
    switch (project) {
      default:
        return "";
    }
  };

  const getSolicitudesRow = (
    arraySolicitude: Array<Solicitude>,
    project?: string,
    recaudaciones: boolean = false
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    (arraySolicitude ?? []).forEach((solicitude: Solicitude, index: number) => {
      jsxArray.push(
        <>
          <tbody key={index}>
            {(solicitude?.items ?? []).map(
              (itemIgFac: Facture, factureIg: number) => {
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
                      {project ?? itemIgFac.project.name ?? ""}
                    </td>
                    {!recaudaciones && (
                      <td style={{ border: "1px solid", width: 250 }}>
                        {getCenterCost(itemIgFac, project) ?? ""}
                      </td>
                    )}
                    <td style={{ border: "1px solid", width: 200 }}>
                      {getProvider(itemIgFac, project) ?? ""}
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
                    <td style={{ border: "1px solid", width: 150 }}>
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
              }
            )}
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  const getTotalValuesRow = (
    arraySolicitudes: Array<Solicitude>,
    project: string,
    recaudaciones: boolean = false
  ): JSX.Element => {
    let value = 0;
    let valueRetention = 0;
    let valueNet = 0;
    let discount = 0;

    (arraySolicitudes ?? []).forEach((solicitude: Solicitude) =>
      solicitude.items.forEach((facture: Facture) => {
        value += facture.value;
        valueRetention += facture.valueRetention;
        valueNet += facture.valueNet;
        discount += facture.discount;
      })
    );

    return (
      <tr
        style={{
          border: "1px solid",
          fontSize: "11px",
          textAlign: "center",
        }}
      >
        <th
          colSpan={recaudaciones ? 6 : 7}
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
      </tr>
    );
  };

  const getNominasRow = (
    arraySolicitude: Array<Nomina>,
    project?: string
  ): Array<JSX.Element> => {
    let value = 0;
    const jsxArray: Array<JSX.Element> = [];
    (arraySolicitude ?? []).forEach((solicitude: Nomina, index: number) => {
      jsxArray.push(
        <>
          <thead>
            <tr
              style={{
                border: "1px solid",
                fontSize: "11px",
                textAlign: "center",
                background: "#8c4343",
              }}
            >
              <th>Colaborador</th>
              <th>Mes</th>
              <th>Cedula</th>
              <th>Departamento</th>
              <th>Cargo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody key={index}>
            {(solicitude?.items ?? []).map(
              (itemIgFac: FactureEmployees, factureIg: number) => {
                value += parseFloat(itemIgFac.value);
                return (
                  <tr
                    style={{
                      border: "1px solid",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <td style={{ border: "1px solid", width: "300px" }}>
                      {itemIgFac.beneficiary ?? ""}
                    </td>
                    <td style={{ border: "1px solid", width: "300px" }}>
                      {solicitude.month ?? ""}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {itemIgFac.identificationCard}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {itemIgFac.department ?? ""}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {itemIgFac.position ?? ""}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {(itemIgFac.value ?? "").toLocaleString()}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </>
      );
    });
    return jsxArray;
  };
  const fecha = Router.query.dateString;

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
          {(nomina.get("nomina") ?? []).length !== 0 && (
            <>
              <h5 className="text-center mb-3 fw-bold">NOMINA</h5>
              <div id="nomina">
                <table style={{ width: "100%" }}>
                  {getNominasRow(nomina.get("nomina"), "nomina")}
                </table>
                <br />
                <table
                  style={{
                    border: "1px solid",
                    fontSize: "11px",
                    textAlign: "center",
                    background: "#aed6f1",
                    width: "100%",
                  }}
                >
                  <thead>
                    <th className="text-center" style={{ width: "91.3%" }}>
                      TOTAL NOMINA
                    </th>
                    <th
                      style={{
                        border: "1px solid",
                        textAlign: "center",
                      }}
                    >
                      $
                      {(values.get("valueNomina") ?? "").toLocaleString(
                        "en-US",
                        options
                      )}
                    </th>
                  </thead>
                </table>
              </div>
            </>
          )}
          <h5 className="text-center my-3 fw-bold">SOLICITUDES</h5>
          {(solicitudes.get("const") ?? []).length !== 0 && (
            <>
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
                    <th style={{ width: 250 }}>Solicitante</th>
                    <th style={{ width: 200 }}>Proveedor</th>
                    <th style={{ width: 90 }}>Fecha</th>
                    <th style={{ width: 90 }}># Factura</th>
                    <th
                      style={{
                        width: 400,
                      }}
                    >
                      Detalle
                    </th>
                    <th style={{ width: 150 }}>Valor</th>
                    <th style={{ width: 80 }}>Retencion</th>
                    <th style={{ width: 80 }}>Descuento</th>
                    <th style={{ width: 120 }}>Pagado</th>
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
            </>
          )}
          {(solicitudes.get("ig") ?? []).length !== 0 && (
            <>
              <div id="ig">
                <table style={{ width: "100%" }}>
                  {getSolicitudesRow(solicitudes.get("ig"), "IG")}
                  <tbody>
                    {getTotalValuesRow(solicitudes.get("ig"), "IG")}
                  </tbody>
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("calderon") ?? []).length !== 0 && (
            <>
              <div id="calderon">
                <table style={{ width: "100%" }}>
                  {getSolicitudesRow(solicitudes.get("calderon"), "CALDERON")}
                  <tbody>
                    {getTotalValuesRow(solicitudes.get("calderon"), "CALDERON")}
                  </tbody>
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("balcon") ?? []).length !== 0 && (
            <>
              <div id="balcon">
                <table style={{ width: "100%" }}>
                  {getSolicitudesRow(solicitudes.get("balcon"), "BALCON")}
                  <tbody>
                    {getTotalValuesRow(solicitudes.get("balcon"), "BALCON")}
                  </tbody>
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="recaudaciones">
                <table style={{ width: "100%" }}>
                  {getSolicitudesRow(
                    solicitudes.get("recaudaciones"),
                    "RECAUDACIONES",
                    true
                  )}
                  <tbody>
                    {getTotalValuesRow(
                      solicitudes.get("recaudaciones"),
                      "RECAUDACIONES",
                      true
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
                <th style={{ border: "1px solid", width: 150 }}>
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

          <div
            style={{
              marginBottom: "2em",
              marginTop: "2em",
            }}
          >
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
                    TOTAL ANTICIPOS
                  </th>
                  <th style={{ border: "1px solid", width: 150 }}>
                    ${(values.get("adv-value") ?? "").toLocaleString()}
                  </th>
                  <th style={{ border: "1px solid", width: 80 }}>
                    ${(values.get("adv-valueRetention") ?? "").toLocaleString()}
                  </th>
                  <th style={{ border: "1px solid", width: 80 }}>
                    ${(values.get("adv-discount") ?? "").toLocaleString()}
                  </th>
                  <th style={{ border: "1px solid", width: 120 }}>
                    ${(values.get("adv-valueNet") ?? "").toLocaleString()}
                  </th>
                </tr>
              </tbody>
              <br />
              <tbody>
                <tr
                  style={{
                    border: "1px solid",
                    fontSize: "11px",
                    textAlign: "center",
                    backgroundColor: "#f5b041",
                  }}
                >
                  <th
                    colSpan={7}
                    style={{
                      border: "1px solid",
                      textAlign: "center",
                      width: 400,
                    }}
                  >
                    TOTAL GENERAL
                  </th>
                  <th style={{ border: "1px solid", width: 150 }}>
                    $
                    {(
                      values.get("value") +
                      values.get("adv-value") +
                      values.get("valueNomina")
                    ).toLocaleString() ?? ""}
                  </th>
                  <th style={{ border: "1px solid", width: 80 }}>
                    $
                    {(
                      values.get("valueRetention") +
                      values.get("adv-valueRetention")
                    ).toLocaleString() ?? ""}
                  </th>
                  <th style={{ border: "1px solid", width: 80 }}>
                    $
                    {(
                      values.get("discount") + values.get("adv-discount")
                    ).toLocaleString() ?? ""}
                  </th>
                  <th style={{ border: "1px solid", width: 120 }}>
                    $
                    {(
                      values.get("valueNet") +
                      values.get("adv-valueNet") +
                      values.get("valueNomina")
                    ).toLocaleString() ?? ""}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </LoadingContainer>
    </>
  );
};
export default GeneralReportHistory;
