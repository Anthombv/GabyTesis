import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/use_auth";
import HttpClient from "../../../utils/http_client";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CalculoMoras = () => {
  const { auth } = useAuth();
  const [filtroCliente, setFiltroCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const loadData = async () => {
    const response = await HttpClient(
      "/api/calculoMoras/clientes",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      setClientes(response.data ?? []);
      filtrarClientesPorFiltro(filtroCliente ?? []);
    } else {
      toast.warning(response.message);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrarClientes = (event) => {
    const filtro = event.target.value.toLowerCase();
    setFiltroCliente(filtro);
    filtrarClientesPorFiltro(filtro);
  };

  const filtrarClientesPorFiltro = (filtro) => {
    const clientesFiltrados = filtro
      ? clientes.filter(
          (item) =>
            item.cli_nombre.toLowerCase().includes(filtro) ||
            item.mov_compr1.toLowerCase().startsWith(filtro)
        )
      : [];
    setClientesFiltrados(clientesFiltrados);
  };
  

  return (
    <>
      <div>
        <h1 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Consulta de Mora
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
          <div className="relative md:w-1/4">
            <input
              type="text"
              value={filtroCliente}
              onChange={filtrarClientes}
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

          <div className="overflow-y-auto mx-2 max-h-96 m-2 overflow-x-auto">
            {clientesFiltrados.length > 0 && filtroCliente && (
              <table className="text-xs border w-full">
                <thead>
                  <tr>
                    <th className="border border-black">Nombre</th>
                    <th className="border border-black">Codigo</th>
                    <th className="border border-black">Tipo</th>
                    <th className="border border-black">Valor</th>
                    <th className="border border-black">Pago</th>
                    <th className="border border-black">Debe</th>
                    <th className="border border-black">Cuota</th>
                    <th className="border border-black">Fecha</th>
                    <th className="border border-black">Dias Mora</th>
                    <th className="border border-black">Mora</th>
                    <th className="border border-black">Total Mora</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((item) => {
                    const fechaVencimiento = item.mov_fecven;
                    const fechaVenci = new Date(fechaVencimiento);
                    const fechaFormateadaVencimiento = format(
                      fechaVenci,
                      "dd/MM/yyyy"
                    );
                    const fechaActual = new Date();
                    const diferenciaEnMilisegundos =
                      fechaActual.getTime() - fechaVenci.getTime();
                    const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;
                    const diferenciaEnDias = Math.floor(
                      diferenciaEnMilisegundos / unDiaEnMilisegundos
                    );
                    let mora = 0;
                    let totalMora = 0;
                    mora = ((item.totalDebe * 0.15) / 360) * diferenciaEnDias;
                    totalMora = item.totalDebe + mora;

                    return (
                      <tr key={item} className="whitespace-nowrap">
                        <td className="border border-black">
                          {item.cli_nombre}
                        </td>
                        <td className="border border-black">
                          {item.cli_promoc}
                        </td>
                        <td className="border border-black">
                          {item.mov_compr1}
                        </td>
                        <td className="border border-black">
                          {item.total_valdeb}
                        </td>
                        <td className="border border-black">
                          {item.total_valcre}
                        </td>
                        <td className="border border-black">
                          {item.totalDebe.toFixed(2)}
                        </td>

                        <td className="border border-black">
                          {item.mov_numsec}
                        </td>
                        <td className="border border-black">
                          {fechaFormateadaVencimiento}
                        </td>

                        <td className="border border-black">
                          {diferenciaEnDias}
                        </td>

                        <td className="border border-black">
                          {mora.toFixed(2)}
                        </td>

                        <td className="border border-black">
                          {totalMora.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculoMoras;
