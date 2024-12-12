import Router from "next/router";
import { useEffect, useState } from "react";
import LoadingContainer from "../../pages/components/loading_container";
import { useAuth } from "../../lib/hooks/use_auth";
import { Facture, Solicitude } from "../../model";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import HttpClient from "../../lib/utils/http_client";

const GeneralReportSoliciter = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesbySoliciteric, setSolicitudesbySoliciteric] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [solicitudesbySoliciterig, setSolicitudesbySoliciterig] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [solicitudesbySoliciterCal, setSolicitudesbySoliciterCal] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [solicitudesbySoliciterBal, setSolicitudesbySoliciterBal] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [solicitudesbySoliciterRec, setSolicitudesbySoliciterRec] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [advancesbySoliciteric, setAdvancesbySoliciteric] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [advancesbySoliciterig, setAdvancesbySoliciterig] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [advancesbySoliciterCal, setAdvancesbySoliciterCal] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [advancesbySoliciterBal, setAdvancesbySoliciterBal] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [advancesbySoliciterRec, setAdvancesbySoliciterRec] = useState<
    Map<String, Array<Solicitude>>
  >(new Map());
  const [busqueda, setBusqueda] = useState("");

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let value = 0;
      let valueRetention = 0;
      let valueNet = 0;
      let discount = 0;
      let advanceValue = 0;
      let advanceValueRetention = 0;
      let advanceValueNet = 0;
      let advanceDiscount = 0;

      const dateString = Router.query.dateString as string;

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
          valueNet += facture.valueNet;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += advanceDiscount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += advanceDiscount;
        });
      });

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

      setValues(
        new Map([
          ["value", value],
          ["valueRetention", valueRetention],
          ["discount", discount],
          ["valueNet", valueNet],
          ["adv-value", advanceValue],
          ["adv-valueRetention", advanceValueRetention],
          ["adv-valueNet", advanceValueNet],
          ["adv-discount", advanceDiscount],
        ])
      );

      let auxSolicitudesBySoliciteric: Map<
        String,
        Array<Solicitude>
      > = new Map();
      concatConst.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxSolicitudesBySoliciteric.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxSolicitudesBySoliciteric.set(solicitude.soliciter, [solicitude]);
        } else {
          auxSolicitudesBySoliciteric.set(solicitude.soliciter, [
            ...auxSolicitudesBySoliciteric.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setSolicitudesbySoliciteric(auxSolicitudesBySoliciteric);

      let auxSolicitudesBySoliciterig: Map<
        String,
        Array<Solicitude>
      > = new Map();
      concatIg.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxSolicitudesBySoliciterig.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxSolicitudesBySoliciterig.set(solicitude.soliciter, [solicitude]);
        } else {
          auxSolicitudesBySoliciterig.set(solicitude.soliciter, [
            ...auxSolicitudesBySoliciterig.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setSolicitudesbySoliciterig(auxSolicitudesBySoliciterig);

      let auxSolicitudesBySolicitercal: Map<
        String,
        Array<Solicitude>
      > = new Map();
      concatCalderon.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxSolicitudesBySolicitercal.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxSolicitudesBySolicitercal.set(solicitude.soliciter, [solicitude]);
        } else {
          auxSolicitudesBySolicitercal.set(solicitude.soliciter, [
            ...auxSolicitudesBySolicitercal.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setSolicitudesbySoliciterCal(auxSolicitudesBySolicitercal);

      let auxSolicitudesBySoliciterbal: Map<
        String,
        Array<Solicitude>
      > = new Map();
      concatBalcon.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxSolicitudesBySoliciterbal.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxSolicitudesBySoliciterbal.set(solicitude.soliciter, [solicitude]);
        } else {
          auxSolicitudesBySoliciterbal.set(solicitude.soliciter, [
            ...auxSolicitudesBySoliciterbal.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setSolicitudesbySoliciterBal(auxSolicitudesBySoliciterbal);

      let auxSolicitudesBySoliciterrec: Map<
        String,
        Array<Solicitude>
      > = new Map();
      concatRecaudaciones.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxSolicitudesBySoliciterrec.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxSolicitudesBySoliciterrec.set(solicitude.soliciter, [solicitude]);
        } else {
          auxSolicitudesBySoliciterrec.set(solicitude.soliciter, [
            ...auxSolicitudesBySoliciterrec.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setSolicitudesbySoliciterRec(auxSolicitudesBySoliciterrec);

      let auxAdvancesBySoliciteric: Map<String, Array<Solicitude>> = new Map();
      concatAdvConst.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxAdvancesBySoliciteric.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxAdvancesBySoliciteric.set(solicitude.soliciter, [solicitude]);
        } else {
          auxAdvancesBySoliciteric.set(solicitude.soliciter, [
            ...auxAdvancesBySoliciteric.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setAdvancesbySoliciteric(auxAdvancesBySoliciteric);

      let auxAdvancesBySoliciterig: Map<String, Array<Solicitude>> = new Map();
      concatAdvIg.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxAdvancesBySoliciterig.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxAdvancesBySoliciterig.set(solicitude.soliciter, [solicitude]);
        } else {
          auxAdvancesBySoliciterig.set(solicitude.soliciter, [
            ...auxAdvancesBySoliciterig.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setAdvancesbySoliciterig(auxAdvancesBySoliciterig);

      let auxAdvancesBySolicitercal: Map<String, Array<Solicitude>> = new Map();
      concatAdvCalderon.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxAdvancesBySolicitercal.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxAdvancesBySolicitercal.set(solicitude.soliciter, [solicitude]);
        } else {
          auxAdvancesBySolicitercal.set(solicitude.soliciter, [
            ...auxAdvancesBySolicitercal.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setAdvancesbySoliciterCal(auxAdvancesBySolicitercal);

      let auxAdvancesBySoliciterbal: Map<String, Array<Solicitude>> = new Map();
      concatAdvBalcon.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxAdvancesBySoliciterbal.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxAdvancesBySoliciterbal.set(solicitude.soliciter, [solicitude]);
        } else {
          auxAdvancesBySoliciterbal.set(solicitude.soliciter, [
            ...auxAdvancesBySoliciterbal.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setAdvancesbySoliciterBal(auxAdvancesBySoliciterbal);

      let auxAdvancesBySoliciterrec: Map<String, Array<Solicitude>> = new Map();
      concatAdvRecaudaciones.forEach((solicitude: Solicitude) => {
        if (
          !Array.from(auxAdvancesBySoliciterrec.keys()).includes(
            solicitude.soliciter
          )
        ) {
          auxAdvancesBySoliciterrec.set(solicitude.soliciter, [solicitude]);
        } else {
          auxAdvancesBySoliciterrec.set(solicitude.soliciter, [
            ...auxAdvancesBySoliciterrec.get(solicitude.soliciter),
            solicitude,
          ]);
        }
      });
      setAdvancesbySoliciterRec(auxAdvancesBySoliciterrec);

      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  const filterBySoliciter = (
    solicitudes: Map<String, Array<Solicitude>>
  ): Map<String, Array<Solicitude>> => {
    const filtered: Map<String, Array<Solicitude>> = new Map();
    solicitudes.forEach((solicitude: Array<Solicitude>, project: string) => {
      const filteredSolicitudes: Array<Solicitude> = solicitude.filter(
        (item) =>
          item.soliciter?.toLowerCase() === busqueda.toLowerCase() ||
          item.soliciter?.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.number?.toString().toLowerCase() === busqueda.toLowerCase()
      );
      if (filteredSolicitudes.length > 0) {
        filtered.set(project, filteredSolicitudes);
      }
    });
    return filtered;
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectFacturesTotal = (
    solicitudes: Array<Solicitude>,
    solicitudeNumber: string
  ): JSX.Element => {
    let value = 0;
    let valueRetention = 0;
    let valueNet = 0;
    let discount = 0;
    solicitudes.forEach((solicitude: Solicitude) => {
      solicitude.items.forEach((facture: Facture) => {
        value += facture.value;
        valueRetention += facture.valueRetention;
        valueNet += facture.valueNet;
        discount += facture.discount;
      });
    });
    return (
      <>
        <th
          colSpan={11}
          style={{
            border: "1px solid",
            textAlign: "center",
            width: "90%",
            backgroundColor: "#aed6f1",
          }}
        >
          TOTAL {solicitudeNumber}
        </th>
        <th
          style={{
            border: "1px solid",
            backgroundColor: "#aed6f1",
          }}
        >
          ${(value ?? "").toLocaleString()}
        </th>
        {CheckPermissions(auth, [0, 2]) && (
          <th style={{ border: "1px solid", backgroundColor: "#aed6f1" }}>
            ${(valueRetention ?? "").toLocaleString()}
          </th>
        )}
        {CheckPermissions(auth, [0, 2]) && (
          <th
            style={{
              border: "1px solid",
              backgroundColor: "#aed6f1",
            }}
          >
            ${(valueNet ?? "").toLocaleString()}
          </th>
        )}
      </>
    );
  };

  const getSolicitudesBySoliciteric = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Solicitude[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach(
      (factures: Array<Solicitude>, solicitudeNumber: string) => {
        jsxArray.push(
          <>
            <div key={solicitudeNumber}>
              {(factures ?? []).map((item: Solicitude, factureIg: number) => {
                return (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <table width={"100%"}>
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            background: "#8c4343",
                          }}
                        >
                          <th style={{ width: 40, border: "1px solid" }}>#</th>
                          <th style={{ width: 40, border: "1px solid" }}>
                            fecha
                          </th>
                          <th style={{ width: 71, border: "1px solid" }}>
                            Solicitante
                          </th>
                          <th style={{ width: 120, border: "1px solid" }}>
                            Proyecto
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Centro de Costos
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Proveedor
                          </th>
                          <th style={{ width: 80, border: "1px solid" }}>
                            Fecha fac
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            # Factura
                          </th>
                          <th
                            style={{
                              width: 220,
                              border: "1px solid",
                            }}
                          >
                            Detalle
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Solicitante
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Contabilidad
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Tesoreria
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            Valor
                          </th>
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 50, border: "1px solid" }}>
                              Retencion
                            </th>
                          )}
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 60, border: "1px solid" }}>
                              Pagado
                            </th>
                          )}
                        </tr>
                      </thead>
                      {item.items.map((facture: Facture) => (
                        <>
                          <tbody>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 40,
                              }}
                            >
                              {item.number ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.date.substring(0, 10) ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.soliciter ?? ""}
                            </td>
                           
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 200,
                              }}
                            >
                              {facture.provider.name ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 80,
                              }}
                            >
                              {facture.factureDate ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 65,
                                padding: "0.25em",
                              }}
                            >
                              {facture.factureNumber ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 420,
                                textAlign: "left",
                                padding: "0.25em",
                              }}
                            >
                              {facture.details ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observation}
                            </td>
                           
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observationTreasury}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 60,
                              }}
                            >
                              {(facture.value ?? "").toLocaleString()}
                            </td>
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 50,
                                }}
                              >
                                {(
                                  facture.valueRetention ?? ""
                                ).toLocaleString()}
                              </td>
                            )}
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 60,
                                }}
                              >
                                {(facture.valueNet ?? "").toLocaleString()}
                              </td>
                            )}
                          </tbody>
                        </>
                      ))}
                      <tr
                        style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}
                      ></tr>
                    </table>
                    <br />
                  </div>
                );
              })}
              <table width={"100%"}>
                <thead>
                  <tr>{projectFacturesTotal(factures, "IC")}</tr>
                </thead>
              </table>
              <br />
            </div>
          </>
        );
      }
    );
    return jsxArray;
  };

  const getSolicitudesBySoliciterig = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Solicitude[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach(
      (factures: Array<Solicitude>, solicitudeNumber: string) => {
        jsxArray.push(
          <>
            <div key={solicitudeNumber}>
              {(factures ?? []).map((item: Solicitude, factureIg: number) => {
                return (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <table width={"100%"}>
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            background: "#8c4343",
                          }}
                        >
                          <th style={{ width: 40, border: "1px solid" }}>#</th>
                          <th style={{ width: 40, border: "1px solid" }}>
                            fecha
                          </th>
                          <th style={{ width: 71, border: "1px solid" }}>
                            Solicitante
                          </th>
                          <th style={{ width: 120, border: "1px solid" }}>
                            Proyecto
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Centro de Costos
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Proveedor
                          </th>
                          <th style={{ width: 80, border: "1px solid" }}>
                            Fecha fac
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            # Factura
                          </th>
                          <th
                            style={{
                              width: 220,
                              border: "1px solid",
                            }}
                          >
                            Detalle
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Solicitante
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Contabilidad
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Tesoreria
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            Valor
                          </th>
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 50, border: "1px solid" }}>
                              Retencion
                            </th>
                          )}
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 60, border: "1px solid" }}>
                              Pagado
                            </th>
                          )}
                        </tr>
                      </thead>
                      {item.items.map((facture: Facture) => (
                        <>
                          <tbody>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 40,
                              }}
                            >
                              {item.number ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.date.substring(0, 10) ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.soliciter ?? ""}
                            </td>
                           

                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 80,
                              }}
                            >
                              {facture.factureDate ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 65,
                                padding: "0.25em",
                              }}
                            >
                              {facture.factureNumber ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 420,
                                textAlign: "left",
                                padding: "0.25em",
                              }}
                            >
                              {facture.details ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observation}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observationTreasury}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 60,
                              }}
                            >
                              {(facture.value ?? "").toLocaleString()}
                            </td>
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 50,
                                }}
                              >
                                {(
                                  facture.valueRetention ?? ""
                                ).toLocaleString()}
                              </td>
                            )}
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 60,
                                }}
                              >
                                {(facture.valueNet ?? "").toLocaleString()}
                              </td>
                            )}
                          </tbody>
                        </>
                      ))}
                      <tr
                        style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}
                      ></tr>
                    </table>
                    <br />
                  </div>
                );
              })}
              <table width={"100%"}>
                <thead>
                  <tr>{projectFacturesTotal(factures, "IG")}</tr>
                </thead>
              </table>
              <br />
            </div>
          </>
        );
      }
    );
    return jsxArray;
  };

  const getSolicitudesBySolicitercal = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Solicitude[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach(
      (factures: Array<Solicitude>, solicitudeNumber: string) => {
        jsxArray.push(
          <>
            <div key={solicitudeNumber}>
              {(factures ?? []).map((item: Solicitude, factureIg: number) => {
                return (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <table width={"100%"}>
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            background: "#8c4343",
                          }}
                        >
                          <th style={{ width: 40, border: "1px solid" }}>#</th>
                          <th style={{ width: 40, border: "1px solid" }}>
                            fecha
                          </th>
                          <th style={{ width: 71, border: "1px solid" }}>
                            Solicitante
                          </th>
                          <th style={{ width: 120, border: "1px solid" }}>
                            Proyecto
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Centro de Costos
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Proveedor
                          </th>
                          <th style={{ width: 80, border: "1px solid" }}>
                            Fecha fac
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            # Factura
                          </th>
                          <th
                            style={{
                              width: 220,
                              border: "1px solid",
                            }}
                          >
                            Detalle
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Solicitante
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Contabilidad
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Tesoreria
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            Valor
                          </th>
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 50, border: "1px solid" }}>
                              Retencion
                            </th>
                          )}
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 60, border: "1px solid" }}>
                              Pagado
                            </th>
                          )}
                        </tr>
                      </thead>
                      {item.items.map((facture: Facture) => (
                        <>
                          <tbody>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 40,
                              }}
                            >
                              {item.number ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.date.substring(0, 10) ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.soliciter ?? ""}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 80,
                              }}
                            >
                              {facture.factureDate ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 65,
                                padding: "0.25em",
                              }}
                            >
                              {facture.factureNumber ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 420,
                                textAlign: "left",
                                padding: "0.25em",
                              }}
                            >
                              {facture.details ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observation}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observationTreasury}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 60,
                              }}
                            >
                              {(facture.value ?? "").toLocaleString()}
                            </td>
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 50,
                                }}
                              >
                                {(
                                  facture.valueRetention ?? ""
                                ).toLocaleString()}
                              </td>
                            )}
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 60,
                                }}
                              >
                                {(facture.valueNet ?? "").toLocaleString()}
                              </td>
                            )}
                          </tbody>
                        </>
                      ))}
                      <tr
                        style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}
                      ></tr>
                    </table>
                    <br />
                  </div>
                );
              })}
              <table width={"100%"}>
                <thead>
                  <tr>{projectFacturesTotal(factures, "CALDERON")}</tr>
                </thead>
              </table>
              <br />
            </div>
          </>
        );
      }
    );
    return jsxArray;
  };

  const getSolicitudesBySoliciterbal = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Solicitude[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach(
      (factures: Array<Solicitude>, solicitudeNumber: string) => {
        jsxArray.push(
          <>
            <div key={solicitudeNumber}>
              {(factures ?? []).map((item: Solicitude, factureIg: number) => {
                return (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <table width={"100%"}>
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            background: "#8c4343",
                          }}
                        >
                          <th style={{ width: 40, border: "1px solid" }}>#</th>
                          <th style={{ width: 40, border: "1px solid" }}>
                            fecha
                          </th>
                          <th style={{ width: 71, border: "1px solid" }}>
                            Solicitante
                          </th>
                          <th style={{ width: 120, border: "1px solid" }}>
                            Proyecto
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Centro de Costos
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Proveedor
                          </th>
                          <th style={{ width: 80, border: "1px solid" }}>
                            Fecha fac
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            # Factura
                          </th>
                          <th
                            style={{
                              width: 220,
                              border: "1px solid",
                            }}
                          >
                            Detalle
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Solicitante
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Contabilidad
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Tesoreria
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            Valor
                          </th>
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 50, border: "1px solid" }}>
                              Retencion
                            </th>
                          )}
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 60, border: "1px solid" }}>
                              Pagado
                            </th>
                          )}
                        </tr>
                      </thead>
                      {item.items.map((facture: Facture) => (
                        <>
                          <tbody>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 40,
                              }}
                            >
                              {item.number ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.date.substring(0, 10) ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.soliciter ?? ""}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 80,
                              }}
                            >
                              {facture.factureDate ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 65,
                                padding: "0.25em",
                              }}
                            >
                              {facture.factureNumber ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 420,
                                textAlign: "left",
                                padding: "0.25em",
                              }}
                            >
                              {facture.details ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observation}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observationTreasury}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 60,
                              }}
                            >
                              {(facture.value ?? "").toLocaleString()}
                            </td>
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 50,
                                }}
                              >
                                {(
                                  facture.valueRetention ?? ""
                                ).toLocaleString()}
                              </td>
                            )}
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 60,
                                }}
                              >
                                {(facture.valueNet ?? "").toLocaleString()}
                              </td>
                            )}
                          </tbody>
                        </>
                      ))}
                      <tr
                        style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}
                      ></tr>
                    </table>
                    <br />
                  </div>
                );
              })}
              <table width={"100%"}>
                <thead>
                  <tr>{projectFacturesTotal(factures, "BALCON")}</tr>
                </thead>
              </table>
              <br />
            </div>
          </>
        );
      }
    );
    return jsxArray;
  };

  const getSolicitudesBySoliciterrec = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Solicitude[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach(
      (factures: Array<Solicitude>, solicitudeNumber: string) => {
        jsxArray.push(
          <>
            <div key={solicitudeNumber}>
              {(factures ?? []).map((item: Solicitude, factureIg: number) => {
                return (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    key={factureIg}
                  >
                    <table width={"100%"}>
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            background: "#8c4343",
                          }}
                        >
                          <th style={{ width: 40, border: "1px solid" }}>#</th>
                          <th style={{ width: 40, border: "1px solid" }}>
                            fecha
                          </th>
                          <th style={{ width: 71, border: "1px solid" }}>
                            Solicitante
                          </th>
                          <th style={{ width: 120, border: "1px solid" }}>
                            Proyecto
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Centro de Costos
                          </th>
                          <th style={{ width: 200, border: "1px solid" }}>
                            Proveedor
                          </th>
                          <th style={{ width: 80, border: "1px solid" }}>
                            Fecha fac
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            # Factura
                          </th>
                          <th
                            style={{
                              width: 220,
                              border: "1px solid",
                            }}
                          >
                            Detalle
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Solicitante
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Contabilidad
                          </th>
                          <th style={{ width: 160, border: "1px solid" }}>
                            Observacion Tesoreria
                          </th>
                          <th style={{ width: 60, border: "1px solid" }}>
                            Valor
                          </th>
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 50, border: "1px solid" }}>
                              Retencion
                            </th>
                          )}
                          {CheckPermissions(auth, [0, 2]) && (
                            <th style={{ width: 60, border: "1px solid" }}>
                              Pagado
                            </th>
                          )}
                        </tr>
                      </thead>
                      {item.items.map((facture: Facture) => (
                        <>
                          <tbody>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 40,
                              }}
                            >
                              {item.number ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.date.substring(0, 10) ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 71,
                              }}
                            >
                              {item.soliciter ?? ""}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 80,
                              }}
                            >
                              {facture.factureDate ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 65,
                                padding: "0.25em",
                              }}
                            >
                              {facture.factureNumber ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                width: 420,
                                textAlign: "left",
                                padding: "0.25em",
                              }}
                            >
                              {facture.details ?? ""}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observation}
                            </td>
                            
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 100,
                              }}
                            >
                              {facture.observationTreasury}
                            </td>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "0.25em",
                                width: 60,
                              }}
                            >
                              {(facture.value ?? "").toLocaleString()}
                            </td>
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 50,
                                }}
                              >
                                {(
                                  facture.valueRetention ?? ""
                                ).toLocaleString()}
                              </td>
                            )}
                            {CheckPermissions(auth, [0, 2]) && (
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0.25em",
                                  width: 60,
                                }}
                              >
                                {(facture.valueNet ?? "").toLocaleString()}
                              </td>
                            )}
                          </tbody>
                        </>
                      ))}
                      <tr
                        style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}
                      ></tr>
                    </table>
                    <br />
                  </div>
                );
              })}
              <table width={"100%"}>
                <thead>
                  <tr>{projectFacturesTotal(factures, "RECAUDACIONES")}</tr>
                </thead>
              </table>
              <br />
            </div>
          </>
        );
      }
    );
    return jsxArray;
  };

  const fecha = Router.query.dateString as String;

  return (
    <>
      <title>Reporte de Solicitantes</title>
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
      <LoadingContainer visible={!loading}>
        <h2 className="text-center my-3 font-bold text-2xl">
          REPORTE DE SOLICITANTES {fecha}
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className="relative flex items-center w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search text-gray-400"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring focus:ring-blue-300 focus:border-blue-300"
              value={busqueda}
              placeholder="Buscar aquí..."
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-center mb-3 font-bold text-xl">SOLICITUDES</h3>
        <div
          style={{ width: "100%", fontSize: "11px", marginBottom: "2em" }}
          className="mx-auto"
        >
          {(solicitudes.get("const") ?? []).length !== 0 && (
            <>
              <div id="const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciteric(
                      solicitudes.get("const"),
                      busqueda.length > 0
                        ? filterBySoliciter(solicitudesbySoliciteric)
                        : solicitudesbySoliciteric
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("ig") ?? []).length !== 0 && (
            <>
              <div id="ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciterig(
                      solicitudes.get("ig"),
                      busqueda.length > 0
                        ? filterBySoliciter(solicitudesbySoliciterig)
                        : solicitudesbySoliciterig
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("calderon") ?? []).length !== 0 && (
            <>
              <div id="calderon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySolicitercal(
                      solicitudes.get("calderon"),
                      busqueda.length > 0
                        ? filterBySoliciter(solicitudesbySoliciterCal)
                        : solicitudesbySoliciterCal
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("balcon") ?? []).length !== 0 && (
            <>
              <div id="balcon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciterbal(
                      solicitudes.get("balcon"),
                      busqueda.length > 0
                        ? filterBySoliciter(solicitudesbySoliciterBal)
                        : solicitudesbySoliciterBal
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="recaudaciones" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciterrec(
                      solicitudes.get("recaudaciones"),
                      busqueda.length > 0
                        ? filterBySoliciter(solicitudesbySoliciterRec)
                        : solicitudesbySoliciterRec
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          <h3 className="text-center mb-3 font-bold text-xl">ANTICIPOS</h3>
          {(solicitudes.get("adv-const") ?? []).length !== 0 && (
            <>
              <div id="adv-const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciteric(
                      solicitudes.get("adv-const"),
                      busqueda.length > 0
                        ? filterBySoliciter(advancesbySoliciteric)
                        : advancesbySoliciteric
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("adv-ig") ?? []).length !== 0 && (
            <>
              <div id="adv-ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {CheckPermissions(auth, [0, 2, 3]) && (
                    <>
                      {getSolicitudesBySoliciterig(
                        solicitudes.get("adv-ig"),
                        busqueda.length > 0
                          ? filterBySoliciter(advancesbySoliciterig)
                          : advancesbySoliciterig
                      )}
                    </>
                  )}
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("adv-calderon") ?? []).length !== 0 && (
            <>
              <div id="adv-calderon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySolicitercal(
                      solicitudes.get("adv-calderon"),
                      busqueda.length > 0
                        ? filterBySoliciter(advancesbySoliciterCal)
                        : advancesbySoliciterCal
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("adv-balcon") ?? []).length !== 0 && (
            <>
              <div id="adv-balcon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciterbal(
                      solicitudes.get("adv-balcon"),
                      busqueda.length > 0
                        ? filterBySoliciter(advancesbySoliciterBal)
                        : advancesbySoliciterBal
                    )}
                  </>
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("adv-recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="adv-recaudaciones" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <>
                    {getSolicitudesBySoliciterrec(
                      solicitudes.get("adv-recaudaciones"),
                      busqueda.length > 0
                        ? filterBySoliciter(advancesbySoliciterRec)
                        : advancesbySoliciterRec
                    )}
                  </>
                </table>
              </div>
            </>
          )}
        </div>
      </LoadingContainer>
    </>
  );
};
export default GeneralReportSoliciter;
