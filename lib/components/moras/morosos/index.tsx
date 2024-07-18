import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/use_auth";
import HttpClient from "../../../utils/http_client";
import { toast } from "react-toastify";

const Morosos = () => {
  const { auth } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [filtros, setFiltros] = useState([]);

  const loadData = async () => {
    const response = await HttpClient(
      "/api/calculoMoras/mora",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      setClientes(response.data ?? []);
    } else {
      toast.warning(response.message);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const promociones = clientes.reduce((agrupado, item) => {
    const promocion = item.cli_promoc;
    const totalDebe = item.totalDebe;
    const totalValCre = item.total_valcre;

    const fechaVencimiento = item.mov_fecven;
    const fechaVenci = new Date(fechaVencimiento);
    const fechaActual = new Date();
    const diferenciaEnMilisegundos =
      fechaActual.getTime() - fechaVenci.getTime();
    const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;
    const diferenciaEnDias = Math.floor(
      diferenciaEnMilisegundos / unDiaEnMilisegundos
    );

    let interes = 0;

    if (item.mov_codcli.slice(-1) !== "L") {
      interes = ((item.totalDebe * 0.15) / 360) * diferenciaEnDias;
    }
    const totalMora = item.totalDebe + interes;

    if (diferenciaEnDias > 0) {
      if (agrupado.hasOwnProperty(promocion)) {
        if (diferenciaEnDias > agrupado[promocion].maxDiferenciaEnDias) {
          agrupado[promocion].maxDiferenciaEnDias = diferenciaEnDias;
        }
        agrupado[promocion].totalDebe += totalDebe;
        agrupado[promocion].totalValCre += totalValCre;
        agrupado[promocion].interes += interes;
        agrupado[promocion].totalMora += totalMora;
      } else {
        agrupado[promocion] = {
          item,
          totalDebe,
          totalValCre,
          interes,
          totalMora,
          maxDiferenciaEnDias: diferenciaEnDias,
        };
      }
    }

    return agrupado;
  }, {});

  let totalFinalMora = 0;
  let totalFinalIntereses = 0;
  let totalFinalMoraInteres = 0;

  let totalFinalMora1a2 = 0;
  let totalFinalIntereses1a2 = 0;
  let totalFinalMoraInteres1a2 = 0;

  let totalFinalMora2a3 = 0;
  let totalFinalIntereses2a3 = 0;
  let totalFinalMoraInteres2a3 = 0;

  let totalFinalMora3a6 = 0;
  let totalFinalIntereses3a6 = 0;
  let totalFinalMoraInteres3a6 = 0;

  let totalFinalMora6 = 0;
  let totalFinalIntereses6 = 0;
  let totalFinalMoraInteres6 = 0;

  const handleFiltroChange = (filtro) => {
    if (filtros.includes(filtro)) {
      // Si el filtro ya está seleccionado, lo eliminamos
      setFiltros(filtros.filter((f) => f !== filtro));
    } else {
      // Si el filtro no está seleccionado, lo agregamos
      setFiltros([...filtros, filtro]);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Clientes en interes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-2 w-full">
          <div className="mt-4">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("CUOTA")}
                onChange={() => handleFiltroChange("CUOTA")}
              />
              Cuota
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("ALICUOTA")}
                onChange={() => handleFiltroChange("ALICUOTA")}
              />
              Alicuota
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtros.includes("ESCRITURA")}
                onChange={() => handleFiltroChange("ESCRITURA")}
              />
              Escritura
            </label>
          </div>

          <div className="mt-4">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("DIRECTO")}
                onChange={() => handleFiltroChange("DIRECTO")}
              />
              DIRECTO
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("BIESS")}
                onChange={() => handleFiltroChange("BIESS")}
              />
              BIESS
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("CONTADO")}
                onChange={() => handleFiltroChange("CONTADO")}
              />
              CONTADO
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtros.includes("MIXTO")}
                onChange={() => handleFiltroChange("MIXTO")}
              />
              MIXTO
            </label>
          </div>

          <div className="mt-4">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("EL EDEN")}
                onChange={() => handleFiltroChange("EL EDEN")}
              />
              EL EDEN
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("EL JARDIN")}
                onChange={() => handleFiltroChange("EL JARDIN")}
              />
              EL JARDIN
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("EL MANANTIAL")}
                onChange={() => handleFiltroChange("EL MANANTIAL")}
              />
              EL MANANTIAL
            </label>
            <br />
            <label className="mr-2">
              <input
                type="checkbox"
                checked={filtros.includes("MIRADOR DEL LAGO")}
                onChange={() => handleFiltroChange("MIRADOR DEL LAGO")}
              />
              MIRADOR DEL LAGO
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtros.includes("BALCON DEL CAONY")}
                onChange={() => handleFiltroChange("BALCON DEL CAONY")}
              />
              BALCON DEL CAONY
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
          <div className="overflow-y-auto mx-2 max-h-96 m-2 overflow-x-auto">
            <table className="text-sm border w-full">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="border border-black">Tipo de Mora</th>
                  <th className="border border-black">Codigo</th>
                  <th className="border border-black">Cliente</th>
                  <th className="border border-black">Proyectos</th>
                  <th className="border border-black">Telefono</th>
                  <th className="border border-black">Tipo</th>
                  <th className="border border-black">Financiamiento</th>
                  <th className="border border-black">Asesor</th>
                  <th className="border border-black">Dias de Mora</th>
                  <th className="border border-black">Mora</th>
                  <th className="border border-black">Intereses</th>
                  <th className="border border-black">Mora + Intereses</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-80">
                {Object.entries(promociones).map(
                  ([promocion, data]: [string, any]) => {
                    const item = data.item as any;
                    const totalDebe = data.totalDebe as number;
                    const interes = data.interes as number;
                    const totalMora = data.totalMora as number;
                    const maxDiferenciaEnDias =
                      data.maxDiferenciaEnDias as number;
                    let nombre = "";
                    const ultimaLetra =
                      item.mov_codcli[item.mov_codcli.length - 1].toUpperCase();
                    if (ultimaLetra === "L") {
                      nombre = "ALICUOTA";
                    } else if (ultimaLetra === "A") {
                      nombre = "CUOTA";
                    } else if (ultimaLetra === "E") {
                      nombre = "ESCRITURA";
                    }

                    if (
                      maxDiferenciaEnDias < 30 &&
                      maxDiferenciaEnDias >= 1 &&
                      (filtros.length === 0 ||
                        //combinadox3
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci)) ||
                        //combinadox2 1
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        //combinadox2 2
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        //combinadox2 3
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        //individual 1
                        (filtros.includes(nombre) && filtros.length === 1) ||
                        (filtros.includes(nombre) && filtros.length === 2) ||
                        (filtros.includes(nombre) && filtros.length === 3) ||
                        //individual 2
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        //individual 3
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 3))
                    ) {
                      totalFinalIntereses += interes;
                      totalFinalMora += totalDebe;
                      totalFinalMoraInteres += totalMora;
                      return (
                        <>
                          <tr key={promocion} className="whitespace-nowrap">
                            <td className="border border-black">
                              Menos de 1 mes
                            </td>
                            <td className="border border-black">{promocion}</td>
                            <td className="border border-black">
                              {item.cli_nombre}
                            </td>
                            <td className="border border-black">
                              {item.cli_atenci}
                            </td>
                            <td className="border border-black">
                              {item.cli_telef2}
                            </td>
                            <td className="border border-black">{nombre}</td>
                            <td className="border border-black">
                              {item.cli_tipcli}
                            </td>
                            <td className="border border-black">
                              {item.ven_nombre}
                            </td>
                            <td className="border border-black">
                              {maxDiferenciaEnDias}
                            </td>
                            <td className="border border-black">
                              {totalDebe.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {interes.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {totalMora.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total interes Menos de 1 mes
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMora.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalIntereses.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMoraInteres.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
                {Object.entries(promociones).map(
                  ([promocion, data]: [string, any]) => {
                    const item = data.item as any;
                    const totalDebe = data.totalDebe as number;
                    const interes = data.interes as number;
                    const totalMora = data.totalMora as number;
                    const maxDiferenciaEnDias =
                      data.maxDiferenciaEnDias as number;
                    let nombre = "";
                    const ultimaLetra =
                      item.mov_codcli[item.mov_codcli.length - 1].toUpperCase();
                    if (ultimaLetra === "L") {
                      nombre = "ALICUOTA";
                    } else if (ultimaLetra === "A") {
                      nombre = "CUOTA";
                    } else if (ultimaLetra === "E") {
                      nombre = "ESCRITURA";
                    }
                    if (
                      maxDiferenciaEnDias >= 30 &&
                      maxDiferenciaEnDias < 61 &&
                      (filtros.length === 0 ||
                        //combinadox3
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci)) ||
                        //combinadox2 1
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 7) ||
                        //combinadox2 2
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        //combinadox2 3
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 8) ||
                        //individual 1
                        (filtros.includes(nombre) && filtros.length === 1) ||
                        (filtros.includes(nombre) && filtros.length === 2) ||
                        (filtros.includes(nombre) && filtros.length === 3) ||
                        //individual 2
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        //individual 3
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 3))
                    ) {
                      totalFinalIntereses1a2 += interes;
                      totalFinalMora1a2 += totalDebe;
                      totalFinalMoraInteres1a2 += totalMora;

                      return (
                        <>
                          <tr key={promocion} className="whitespace-nowrap">
                            <td className="border border-black">1 a 2 meses</td>
                            <td className="border border-black">{promocion}</td>
                            <td className="border border-black">
                              {item.cli_nombre}
                            </td>
                            <td className="border border-black">
                              {item.cli_atenci}
                            </td>
                            <td className="border border-black">
                              {item.cli_telef2}
                            </td>
                            <td className="border border-black">{nombre}</td>
                            <td className="border border-black">
                              {item.cli_tipcli}
                            </td>
                            <td className="border border-black">
                              {item.ven_nombre}
                            </td>
                            <td className="border border-black">
                              {maxDiferenciaEnDias}
                            </td>
                            <td className="border border-black">
                              {totalDebe.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {interes.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {totalMora.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total interes de 1 a 2 meses
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMora1a2.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalIntereses1a2.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMoraInteres1a2.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
                {Object.entries(promociones).map(
                  ([promocion, data]: [string, any]) => {
                    const item = data.item as any;
                    const totalDebe = data.totalDebe as number;
                    const interes = data.interes as number;
                    const totalMora = data.totalMora as number;
                    const maxDiferenciaEnDias =
                      data.maxDiferenciaEnDias as number;
                    let nombre = "";
                    const ultimaLetra =
                      item.mov_codcli[item.mov_codcli.length - 1].toUpperCase();
                    if (ultimaLetra === "L") {
                      nombre = "ALICUOTA";
                    } else if (ultimaLetra === "A") {
                      nombre = "CUOTA";
                    } else if (ultimaLetra === "E") {
                      nombre = "ESCRITURA";
                    }
                    if (
                      maxDiferenciaEnDias >= 61 &&
                      maxDiferenciaEnDias < 91 &&
                      (filtros.length === 0 ||
                        //combinadox3
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci)) ||
                        //combinadox2 1
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 7) ||
                        //combinadox2 2
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        //combinadox2 3
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 8) ||
                        //individual 1
                        (filtros.includes(nombre) && filtros.length === 1) ||
                        (filtros.includes(nombre) && filtros.length === 2) ||
                        (filtros.includes(nombre) && filtros.length === 3) ||
                        //individual 2
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        //individual 3
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 3))
                    ) {
                      totalFinalIntereses2a3 += interes;
                      totalFinalMora2a3 += totalDebe;
                      totalFinalMoraInteres2a3 += totalMora;
                      return (
                        <>
                          <tr key={promocion} className="whitespace-nowrap">
                            <td className="border border-black">2 a 3 meses</td>
                            <td className="border border-black">{promocion}</td>
                            <td className="border border-black">
                              {item.cli_nombre}
                            </td>
                            <td className="border border-black">
                              {item.cli_atenci}
                            </td>
                            <td className="border border-black">
                              {item.cli_telef2}
                            </td>
                            <td className="border border-black">{nombre}</td>
                            <td className="border border-black">
                              {item.cli_tipcli}
                            </td>
                            <td className="border border-black">
                              {item.ven_nombre}
                            </td>
                            <td className="border border-black">
                              {maxDiferenciaEnDias}
                            </td>
                            <td className="border border-black">
                              {totalDebe.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {interes.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {totalMora.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total interes 2 a 3 meses
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMora2a3.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalIntereses2a3.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMoraInteres2a3.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
                {Object.entries(promociones).map(
                  ([promocion, data]: [string, any]) => {
                    const item = data.item as any;
                    const totalDebe = data.totalDebe as number;
                    const interes = data.interes as number;
                    const totalMora = data.totalMora as number;
                    const maxDiferenciaEnDias =
                      data.maxDiferenciaEnDias as number;

                    let nombre = "";
                    const ultimaLetra =
                      item.mov_codcli[item.mov_codcli.length - 1].toUpperCase();
                    if (ultimaLetra === "L") {
                      nombre = "ALICUOTA";
                    } else if (ultimaLetra === "A") {
                      nombre = "CUOTA";
                    } else if (ultimaLetra === "E") {
                      nombre = "ESCRITURA";
                    }
                    if (
                      maxDiferenciaEnDias >= 91 &&
                      maxDiferenciaEnDias < 181 &&
                      (filtros.length === 0 ||
                        //combinadox3
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci)) ||
                        //combinadox2 1
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 7) ||
                        //combinadox2 2
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        //combinadox2 3
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 8) ||
                        //individual 1
                        (filtros.includes(nombre) && filtros.length === 1) ||
                        (filtros.includes(nombre) && filtros.length === 2) ||
                        (filtros.includes(nombre) && filtros.length === 3) ||
                        //individual 2
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        //individual 3
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 3))
                    ) {
                      totalFinalIntereses3a6 += interes;
                      totalFinalMora3a6 += totalDebe;
                      totalFinalMoraInteres3a6 += totalMora;
                      return (
                        <>
                          <tr key={promocion} className="whitespace-nowrap">
                            <td className="border border-black">3 a 6 meses</td>
                            <td className="border border-black">{promocion}</td>
                            <td className="border border-black">
                              {item.cli_nombre}
                            </td>
                            <td className="border border-black">
                              {item.cli_atenci}
                            </td>
                            <td className="border border-black">
                              {item.cli_telef2}
                            </td>
                            <td className="border border-black">{nombre}</td>
                            <td className="border border-black">
                              {item.cli_tipcli}
                            </td>
                            <td className="border border-black">
                              {item.ven_nombre}
                            </td>
                            <td className="border border-black">
                              {maxDiferenciaEnDias}
                            </td>
                            <td className="border border-black">
                              {totalDebe.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {interes.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {totalMora.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total interes 3 a 6 meses
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMora3a6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalIntereses3a6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMoraInteres3a6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
                {Object.entries(promociones).map(
                  ([promocion, data]: [string, any]) => {
                    const item = data.item as any;
                    const totalDebe = data.totalDebe as number;
                    const interes = data.interes as number;
                    const totalMora = data.totalMora as number;
                    const maxDiferenciaEnDias =
                      data.maxDiferenciaEnDias as number;

                    let nombre = "";
                    const ultimaLetra =
                      item.mov_codcli[item.mov_codcli.length - 1].toUpperCase();
                    if (ultimaLetra === "L") {
                      nombre = "ALICUOTA";
                    } else if (ultimaLetra === "A") {
                      nombre = "CUOTA";
                    } else if (ultimaLetra === "E") {
                      nombre = "ESCRITURA";
                    }
                    if (
                      maxDiferenciaEnDias > 181 &&
                      (filtros.length === 0 ||
                        //combinadox3
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci)) ||
                        //combinadox2 1
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_tipcli) &&
                          filtros.length === 7) ||
                        //combinadox2 2
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(nombre) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        //combinadox2 3
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 3) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 4) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 5) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 6) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 7) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.includes(item.cli_atenci) &&
                          filtros.length === 8) ||
                        //individual 1
                        (filtros.includes(nombre) && filtros.length === 1) ||
                        (filtros.includes(nombre) && filtros.length === 2) ||
                        (filtros.includes(nombre) && filtros.length === 3) ||
                        //individual 2
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_tipcli) &&
                          filtros.length === 3) ||
                        //individual 3
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 1) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 2) ||
                        (filtros.includes(item.cli_atenci) &&
                          filtros.length === 3))
                    ) {
                      totalFinalIntereses6 += interes;
                      totalFinalMora6 += totalDebe;
                      totalFinalMoraInteres6 += totalMora;
                      return (
                        <>
                          <tr key={promocion} className="whitespace-nowrap">
                            <td className="border border-black">
                              Mas de 6 meses
                            </td>
                            <td className="border border-black">{promocion}</td>
                            <td className="border border-black">
                              {item.cli_nombre}
                            </td>
                            <td className="border border-black">
                              {item.cli_atenci}
                            </td>
                            <td className="border border-black">
                              {item.cli_telef2}
                            </td>
                            <td className="border border-black">{nombre}</td>
                            <td className="border border-black">
                              {item.cli_tipcli}
                            </td>
                            <td className="border border-black">
                              {item.ven_nombre}
                            </td>
                            <td className="border border-black">
                              {maxDiferenciaEnDias}
                            </td>
                            <td className="border border-black">
                              {totalDebe.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {interes.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="border border-black">
                              {totalMora.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total interes mas de 6 meses
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMora6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalIntereses6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {totalFinalMoraInteres6.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="border border-black font-bold">
                    Total General de la Mora
                  </td>
                  <td className="border border-black font-bold">
                    {(
                      totalFinalMora +
                      totalFinalMora1a2 +
                      totalFinalMora2a3 +
                      totalFinalMora3a6 +
                      totalFinalMora6
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {(
                      totalFinalIntereses +
                      totalFinalIntereses1a2 +
                      totalFinalIntereses2a3 +
                      totalFinalIntereses3a6 +
                      totalFinalIntereses6
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="border border-black font-bold">
                    {(
                      totalFinalMoraInteres +
                      totalFinalMoraInteres1a2 +
                      totalFinalMoraInteres2a3 +
                      totalFinalMoraInteres3a6 +
                      totalFinalMoraInteres6
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Morosos;
