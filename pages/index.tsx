/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import Router from "next/router";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import { toast } from "react-toastify";
import { CheckPermissions } from "../lib/utils/check_permissions";

export default function Home() {
  const { auth } = useAuth();

  const handleSolicitudes = () => {
    auth.role === 1
      ? Router.push({ pathname: "/requestsSolicitude" })
      : Router.push({ pathname: "/solicitude" });
  };

  const handleHistory = () => {
    Router.push({ pathname: "/solicitudeHistory" });
  };

  const handleAppReportes = () => {
    Router.push({ pathname: "/reportes" });
  };

  const handleAppVentas = () => {
    Router.push({ pathname: "/ventas" });
  };

  return (
    <>
      <title>Comercial Torres</title>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div
            className="mt-6 "
            style={{ display: "flex", alignItems: "center" }}
          >
            <p
              className="md:text-4xl text-xl text-center m-6"
              style={{
                display: "inline-block",
                color: "#610d9a",
                padding: "12px",
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              <strong>Sistema Contable </strong> |{" "}
              <em
                style={{
                  color: "#bb22dd",
                  fontStyle: "normal",
                  fontSize: "26px",
                }}
              >
                "Comercial Torres"
              </em>
              <hr
                className="mt-0 ml-0 "
                style={{
                  width: "100%",
                  height: "3px",
                  backgroundColor: "#fff",
                }}
              />
            </p>

            <img
              src="/hora2.png"
              alt="Imagen"
              style={{ width: "70px", height: "70px" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-12">
            <div className="bg-slate-100 p-4 rounded-lg w-3/4 m-auto block shadow-md">
              <div className="w-full h-full text-white font-semibold">
                <div className="grid grid-cols-6 justify-center items-center">
                  <div className="col-span-5">
                    <h1
                      className="md:text-4xl text-xl font-serif font-bold text-left"
                      style={{
                        color: "#bb22dd",
                        fontSize: "20px",
                      }}
                    >
                      ADMINISTRATIVO
                    </h1>
                    <h2
                      className="font-sans text-left "
                      style={{
                        color: "#2898db",
                      }}
                    >
                      Pagos a proveedores
                    </h2>
                  </div>
                  <div>
                    <img
                      src="/pago2.png"
                      width={100}
                      height={100}
                      alt="Descripción de la imagen"
                    />
                  </div>
                </div>
                <ul className="text-sm p-2 ml-12">
                  <li>
                    <button
                      className="p-1 md:text-md rounded-full hover:bg-slate-300 text-gray-600 px-8 bg-slate-200 m-2"
                      onClick={handleSolicitudes}
                      disabled={!CheckPermissions(auth, [0, 1, 3, 5])}
                    >
                      Solicitudes de Pagos
                    </button>
                  </li>

                  <li>
                    <button
                      className="p-1 md:text-md rounded-full hover:bg-slate-300 text-gray-600 px-8 bg-slate-200 m-2"
                      onClick={handleHistory}
                      disabled={!CheckPermissions(auth, [0, 1, 3, 5])}
                    >
                      Historial Solicitudes
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* VENTAS */}
            <div className="bg-slate-100 p-4 rounded-lg w-3/4 m-auto block shadow-md">
              <div className="w-full h-full text-white font-semibold">
                <div className="grid grid-cols-6 justify-center items-center">
                  <div className="col-span-5">
                    <h1
                      className="md:text-4xl text-xl font-serif font-bold text-left"
                      style={{
                        color: "#bb22dd",
                        fontSize: "20px",
                      }}
                    >
                      VENTAS
                    </h1>
                    <h2
                      className="font-sans text-left "
                      style={{
                        color: "#2898db",
                      }}
                    >
                      Inventario - Ventas
                    </h2>
                  </div>
                  <div>
                    <img
                      src="/lista.png"
                      width={90}
                      height={90}
                      alt="Descripción de la imagen"
                    />
                  </div>
                </div>
                <ul className="text-sm p-2 ml-12">
                  <li>
                    <button
                      className="p-1 md:text-md rounded-full hover:bg-slate-300 text-gray-600 px-8 bg-slate-200 m-2"
                      onClick={handleAppVentas}
                      disabled={!CheckPermissions(auth, [0, 1, 2])}
                    >
                      Ir al Inventario
                    </button>
                  </li>
                  <li>
                    <button
                      className="p-1 md:text-md rounded-full hover:bg-slate-300 text-gray-600 px-8 bg-slate-200 m-2"
                      onClick={handleAppVentas}
                      disabled={!CheckPermissions(auth, [0, 1, 2, 4])}
                    >
                      Ir al Aplicativo
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* REPORTES */}
            <div className="bg-slate-100 p-4 rounded-lg w-3/4 m-auto block shadow-md">
              <div className="w-full h-full text-white font-semibold">
                <div className="grid grid-cols-6 justify-center items-center">
                  <div className="col-span-5">
                    <h1
                      className="md:text-4xl text-xl font-serif font-bold text-left"
                      style={{
                        color: "#bb22dd",
                        fontSize: "20px",
                      }}
                    >
                      REPORTES
                    </h1>
                    <h2
                      className="font-sans text-left "
                      style={{
                        color: "#2898db",
                      }}
                    >
                      Consulte varios reportes
                    </h2>
                  </div>
                  <div>
                    <img
                      src="/notas.png"
                      width={90}
                      height={90}
                      alt="Descripción de la imagen"
                    />
                  </div>
                </div>
                <ul className="text-sm p-2 ml-12">
                  <li>
                    <button
                      className="p-1 md:text-md rounded-full hover:bg-slate-300 text-gray-600 px-8 bg-slate-200 m-2"
                      onClick={handleAppReportes}
                      disabled={!CheckPermissions(auth, [0, 1])}
                    >
                      Ir al Aplicativo
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
