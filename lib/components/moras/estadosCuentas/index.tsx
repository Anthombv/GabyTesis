import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../hooks/use_auth";
import HttpClient from "../../../utils/http_client";
import { format } from "date-fns";
import Head from "next/head";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../loading_container";

const EstadosCuenta = () => {
  const { auth } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCuotas, setTotalCuotas] = useState(0);
  const [totalAbonos, setTotalAbonos] = useState(0);
  const [valorFiltro, setValorFiltro] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const pageNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ];

      const requests = pageNumbers.map(async (pageNumber) => {
        const response = await HttpClient(
          `/api/calculoMoras/estados?page=${pageNumber}`,
          "GET",
          auth.userName,
          auth.role
        );
        return response.data ?? [];
      });

      const results = await Promise.all(requests);

      const concatenatedData = results.reduce((concatenated, data) => {
        return concatenated.concat(data);
      }, []);

      setClientes(concatenatedData);
      filtrarClientesPorFiltro(concatenatedData ?? []);
    } catch (error) {
      console.error;
    }
    setLoading(false);
  };

  console.log("api", clientes);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrarClientesPorFiltro = (filtro) => {
    const filtroTrimmed = filtro.trim();
    const filtroLowerCase = filtroTrimmed.toLowerCase();
    const clientesFiltrados = filtroTrimmed
      ? clientes.filter(
          (item) => item.mov_compr1.trim().toLowerCase() === filtroLowerCase
        )
      : [];
    setClientesFiltrados(clientesFiltrados);
  };

  const handleChangeFiltro = (event) => {
    setValorFiltro(event.target.value);
  };

  const handleMostrarTabla = () => {
    setMostrarTabla(true);
    filtrarClientesPorFiltro(valorFiltro);
  };

  const clientName =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_nombre : "";
  const lote =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].mov_compr1 : "";
  const proyecto =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_atenci : "";
  const identificacion =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_numruc : "";
  const direccion =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_direc1 : "";
  const telefono1 =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_telef1 : "";
  const telefono2 =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].cli_telef2 : "";

  const fechaActual = new Date();
  const fechaFormateada = format(fechaActual, "dd-MMM-yyyy");
  const fechaUltima =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].mov_fecemi : "";
  let nuevaFecha = "";

  if (fechaUltima !== "") {
    const fecha = new Date(fechaUltima);
    const dia = fecha.getUTCDate();
    const mes = fecha.toLocaleString("default", { month: "short" });
    const anio = fecha.getUTCFullYear();

    nuevaFecha = `${dia}-${mes}-${anio}`;
  }

  const fechaInicial =
    clientesFiltrados.length > 0 ? clientesFiltrados[0].mov_fecemi : "";
  let nuevaFechaInicial = "";

  if (fechaInicial !== "") {
    const fecha = new Date(fechaInicial);
    const dia = fecha.getUTCDate();
    const mes = fecha.toLocaleString("default", { month: "short" });
    const anio = fecha.getUTCFullYear();

    nuevaFechaInicial = `${dia}-${mes}-${anio}`;
  }

  useEffect(() => {
    if (mostrarTabla) {
      const cuotasFiltradas = clientesFiltrados.filter((item) =>
        item.mov_detmo1.startsWith("Registro")
      );
      const totalCuotas = cuotasFiltradas.reduce(
        (total, item) => (total += item.mov_valdeb),
        0
      );
      setTotalCuotas(totalCuotas);
    }
  }, [mostrarTabla, clientesFiltrados]);

  useEffect(() => {
    if (mostrarTabla) {
      const cuotasFiltradas = clientesFiltrados.filter(
        (item) => item.mov_detmo1
      );
      const grupos = cuotasFiltradas.reduce((acumulador, item) => {
        const existente = acumulador.find(
          (elem) => elem.mov_numsec === item.mov_numsec
        );
        if (existente) {
          existente.datos.push(item);
        } else {
          acumulador.push({
            mov_numsec: item.mov_numsec,
            datos: [item],
          });
        }
        return acumulador;
      }, []);

      const totalAbonosCliente = grupos.reduce((total, grupo) => {
        const todosRegistrosValidos = grupo.datos.every(
          (registro) =>
            registro.mov_detmo1.includes("Pago") ||
            registro.mov_detmo1.includes("Registro")
        );
        if (todosRegistrosValidos) {
          grupo.datos.forEach((item) => {
            total += item.mov_valcre;
          });
        }

        return total;
      }, 0);

      setTotalAbonos(totalAbonosCliente);
    }
  }, [mostrarTabla, clientesFiltrados]);

  const saldoActual = totalCuotas - totalAbonos;

  return (
    <>
      <LoadingContainer visible={loading} miniVersion>
        <Head>
          <style>
            {`
         @media print {
            @page {
              margin-top: 1.5em;
              margin-bottom: 1.5em;
            }
            .custom-width {
              width: 297mm;
            }
          }
          @media (min-width: 768px) {
            .custom-width {
              width: 297mm;
            }
          }
        `}
          </style>
        </Head>
        <div>
          <h1 className="text-center font-extrabold text-3xl no-imprimir">
            Estados de Cuenta
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-2 no-imprimir">
            <div className="no-imprimir">
              <input
                type="text"
                value={valorFiltro}
                onChange={handleChangeFiltro}
                placeholder="Filtrar por nombre de cliente"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-2.293-5.707a1 1 0 011.414-1.414l3 3a1 1 0 01-1.414 1.414l-3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="no-imprimir">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleMostrarTabla}
              >
                Mostrar Tabla
              </button>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePrint}
              >
                Imprimir Estado de Cuenta
              </button>
            </div>
          </div>
          <div
            ref={componentRef}
            className="overflow-y-auto mx-2 max-h-full m-2 overflow-x-auto text-sm relative custom-width"
            style={{
              margin: "0 auto",
            }}
          >
            {mostrarTabla && clientesFiltrados.length > 0 && (
              <>
                <h1 className="mb-4 mt-8 text-center font-extrabold text-3xl italic">
                  ESTADO DE CUENTA
                </h1>
                <div className="grid grid-cols-2 gap-4 w-4/5 mx-auto">
                  <div className="border-2 border-blue-700 rounded-2xl p-2 text-base">
                    <h1 className="font-extrabold">{proyecto}</h1>
                    <h1 className="font-semibold">{lote}</h1>
                    <h1 className="font-extrabold">{clientName}</h1>
                    <h1 className="font-semibold">{identificacion}</h1>
                    <h1 className="font-semibold">{direccion}</h1>
                    <h1 className="font-semibold">
                      {telefono2} / {telefono1}
                    </h1>
                  </div>
                  <div className="border-2 border-blue-700 rounded-2xl p-2">
                    <h1 className="font-extrabold text-center">RESUMEN</h1>
                    <div className="grid grid-cols-2 gap-2 uppercase font-semibold">
                      <h1>Fecha Corte:</h1>
                      <h1>{fechaFormateada}</h1>
                      <h1>Fecha ultimo abono:</h1>
                      <h1>{nuevaFecha}</h1>
                      <h1>Precio Venta:</h1>
                      <h1>
                        {totalCuotas.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h1>
                      <h1>Total Abono:</h1>
                      <h1>
                        {totalAbonos.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h1>
                      <h1>Saldo Actual:</h1>
                      <h1>
                        {saldoActual.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 md:w-2/5 text-center mx-auto my-4">
                  <p>
                    <strong>Desde:</strong> {nuevaFechaInicial}
                  </p>
                  <p>
                    <strong>Hasta:</strong> {fechaFormateada}
                  </p>
                </div>
                <div className="w-3/4 text-center mx-auto mb-4 border border-black">
                  <p>
                    Estimado Cliente le recordamos que puede realizar depositos
                    y notificarlos a la siguiente dirección de correo
                    electronico gestionycobranza@grupoancon.com o llamar a los
                    números telefonicos 2221-620 / 2528-289, es un placer
                    servirles.
                  </p>
                </div>
                <table className="text-center mx-8 table-auto">
                  <thead>
                    <tr className="uppercase">
                      <th className="border border-black">N°</th>
                      <th className="border border-black">Detalle</th>
                      <th className="border border-black">
                        Fecha programada de pagos
                      </th>
                      <th className="border border-black">Cuota a cancelar</th>
                      <th className="border border-black">Fecha cancelacion</th>
                      <th className="border border-black">valor cancelado</th>
                      <th className="border border-black">saldo cuota</th>
                      <th className="border border-black">recibo de caja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados
                      .sort((a, b) => {
                        if (a.mov_valdeb !== 0 && b.mov_valdeb === 0) {
                          return -1;
                        } else if (a.mov_valdeb === 0 && b.mov_valdeb !== 0) {
                          return 1;
                        }
                        return 0;
                      })
                      .reduce((acumulador, item) => {
                        const existente = acumulador.find(
                          (elem) => elem.mov_numsec === item.mov_numsec
                        );
                        if (existente) {
                          existente.datos.push(item);
                        } else {
                          acumulador.push({
                            mov_numsec: item.mov_numsec,
                            datos: [item],
                          });
                        }
                        return acumulador;
                      }, [])
                      .map((grupo) => {
                        let saldoCuota = 0;
                        return grupo.datos.map((item, index) => {
                          const fechaEmision = item.mov_fecemi;
                          const fechaEmi = new Date(fechaEmision);
                          const fechaFormateadaEmi = format(
                            fechaEmi,
                            "dd/MM/yyyy"
                          );

                          const cuotaCancelarVacia = item.mov_valdeb === 0;
                          const valorCanceladoVacio = item.mov_valcre === 0;
                          const saldoCuotaVacio =
                            item.mov_valcre === 0 || item.mov_valcre === "";

                          if (index > 0) {
                            saldoCuota += grupo.datos[index - 1].mov_valdeb;
                          }
                          saldoCuota -= item.mov_valcre;
                          const saldoCuotaFormatted =
                            saldoCuota !== 0
                              ? saldoCuota.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })
                              : "-";
                          return (
                            <tr key={item.id} className="whitespace-nowrap">
                              {index === 0 && (
                                <td rowSpan={grupo.datos.length}>
                                  {grupo.mov_numsec}
                                </td>
                              )}
                              <td>{item.mov_detmo1}</td>
                              <td>
                                {cuotaCancelarVacia ? "" : fechaFormateadaEmi}
                              </td>
                              <td>
                                {cuotaCancelarVacia
                                  ? ""
                                  : item.mov_valdeb.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                              </td>
                              <td>
                                {valorCanceladoVacio ? "" : fechaFormateadaEmi}
                              </td>
                              <td>
                                {valorCanceladoVacio
                                  ? ""
                                  : item.mov_valcre.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                              </td>
                              <td>
                                {saldoCuotaVacio
                                  ? ""
                                  : saldoCuotaFormatted === "-$0.00" ||
                                    saldoCuotaFormatted === "$0.00"
                                  ? "-"
                                  : saldoCuotaFormatted}
                              </td>
                              <td>{item.mov_compr2}</td>
                            </tr>
                          );
                        });
                      })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </LoadingContainer>
    </>
  );
};

export default EstadosCuenta;
