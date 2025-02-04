import { useEffect, useState } from "react";
import HttpClient from "../../lib/utils/http_client";
import { useAuth } from "../../lib/hooks/use_auth";
import Router from "next/router";
import LoadingContainer from "../../pages/components/loading_container";
import { Facture, Solicitude } from "../../model";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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

  const fecha = Router.query.dateString;

  solicitudes.forEach((value, key) => {
    console.log(`Clave: ${key}`);
    console.log("Valores:", value);
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  // Convertimos el Map a un array antes de usar reduce
  const resumen = Array.from(solicitudes.values())
    .flat()
    .reduce(
      (acc, solicitud) => {
        const totalSolicitado = solicitud.total || 0;
        const totalDescuento = solicitud.items.reduce(
          (descAcc, item) => descAcc + (item.discount || 0),
          0
        );
        const totalPagado = solicitud.items.reduce(
          (pagAcc, item) => pagAcc + (item.accreditedPayment || 0),
          0
        );

        acc.valorSolicitado += totalSolicitado;
        acc.valorDescuento += totalDescuento;
        acc.valorPagado += totalPagado;

        return acc;
      },
      { valorSolicitado: 0, valorDescuento: 0, valorPagado: 0 }
    );

  const data = {
    labels: ["Valor Solicitado", "Descuento Total", "Valor Pagado"],
    datasets: [
      {
        label: "Reporte de Facturas",
        data: [
          resumen.valorSolicitado,
          resumen.valorDescuento,
          resumen.valorPagado,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Aseguramos el tipo correcto para TypeScript
      },
      title: {
        display: true,
        text: "Reporte Estadístico de Facturas",
      },
    },
  };

  return (
    <>
      <title>Reporte General</title>

      <LoadingContainer visible={!loading}>
        <style>
          {`
          body {
            background-color: #f8f9fa !important;
          }
          @media print {
            .clase-a-ocultar {
              display: none !important;
            }
          }
        `}
        </style>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 my-4 text-center clase-a-ocultar">
          <button
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            onClick={() => window.print()}
          >
            Imprimir
          </button>

          <button
            className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>

        <h4 className="text-center text-xl font-bold mb-3">
          REPORTE GERENCIAL {fecha}
        </h4>
        <h5 className="text-center text-lg font-semibold my-3">
          SOLICITUDES DE PAGO A PROVEEDORES
        </h5>
        <div className="p-4">
          <table className="w-full border-collapse border border-gray-300 shadow-sm">
            <thead>
              <tr className="bg-red-700 text-white text-center text-xs">
                <th className="border p-2">Solicitante</th>
                <th className="border p-2">Proveedor</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2"># Factura</th>
                <th className="border p-2">Detalle</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Retención</th>
                <th className="border p-2">Descuento</th>
                <th className="border p-2">Pagado</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(solicitudes.values())
                .flat()
                .map((solicitud) =>
                  solicitud.items.map((item, index) => (
                    <tr
                      key={`${solicitud.id}-${index}`}
                      className="text-center text-sm bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border p-2">{solicitud.soliciter}</td>
                      <td className="border p-2">{item.provider.name}</td>
                      <td className="border p-2">{item.factureDate}</td>
                      <td className="border p-2">{item.factureNumber}</td>
                      <td className="border p-2">{item.details}</td>
                      <td className="border p-2">{item.value}</td>
                      <td className="border p-2">{item.valueRetention}</td>
                      <td className="border p-2">{item.discount}</td>
                      <td className="border p-2">{item.accreditedPayment}</td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>

          <div className="mt-6 text-base">
            <p className="font-semibold text-gray-700">
              <strong>Valor Solicitado:</strong> ${resumen.valorSolicitado}
            </p>
            <p className="font-semibold text-gray-700">
              <strong>Valor Descuento Total:</strong> ${resumen.valorDescuento}
            </p>
            <p className="font-semibold text-gray-700">
              <strong>Valor Total Pagado:</strong> ${resumen.valorPagado}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2 h-64">
          <Bar data={data} options={options} />
        </div>
      </div>
        </div>
      </LoadingContainer>
    </>
  );
};
export default GeneralReportHistory;
