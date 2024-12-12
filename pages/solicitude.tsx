import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/use_auth";
import { Facture, Solicitude } from "../model";
import HttpClient from "../lib/utils/http_client";
import TreeTable, { ColumnData } from "../pages/components/tree_table";
import { StateField } from "../lib/styles/views/indexStyled";
import { Elaborando, Pendiente } from "../lib/utils/constants";
import { CheckPermissions } from "../lib/utils/check_permissions";
import Router from "next/router";
import { toast } from "react-toastify";
import RoleLayout from "../pages/layouts/role_layout";
import Sidebar from "../pages/components/sidebar";
import { Button, TabContainer } from "react-bootstrap";
import ConfirmModal from "../pages/components/modals/confirm";
import LoadingContainer from "../pages/components/loading_container";

type Props = {
  dates: Array<string>;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

// Inicio de la app
const SolicitudePage = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Solicitude>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);

  const loadData = async () => {
    setLoading(true);

    const response = await HttpClient(
      "/api/solicitude",
      "GET",
      auth.userName,
      auth.role
    );

    const solicitudes: Array<Solicitude> = response.data ?? [];
    setTableData(solicitudes);
    setLoading(false);
  };

  const showConfirmModal = (factureId: string) => setItemToDelete(factureId);
  const hideConfirmModal = () => setItemToDelete(null);

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dates]);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      width: 60,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "date",
      caption: "Fecha de Registro",
      cssClass: "bold",
      width: 140,
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 85,
    },
    {
      dataField: "details",
      caption: "Detalle",
      minWidth: 160,
      cssClass: "bold",
    },
    {
      dataField: "items",
      caption: "Valor Total",
      cellRender: (params) => {
        const factures: Array<Facture> = params.value;
        let total = 0;
        if (factures?.length > 0)
          factures?.forEach((item: Facture) => {
            total += item.value ?? 0;
          });
        const formato = total.toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        });
        return (
          <p style={{ margin: 2 }}>
            <strong>${formato}</strong>
          </p>
        );
      },
      cssClass: "bold",
      width: 100,
    },
    {
      dataField: "soliciterState",
      caption: "Solicitante",
      cellRender: (params) => <StateField state={params.value ?? Elaborando} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "financialState",
      caption: "Financiero",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Facture) =>
      CheckPermissions(auth, [0, 1, 3, 5])
        ? Router.push({
            pathname: "/solicitude/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: async (rowData: Facture) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar una Solicitud");
    },
    download: (rowData: Facture) =>
      CheckPermissions(auth, [0])
        ? Router.push({
            pathname: "/solicitude/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };

  return (
    <>
      <RoleLayout permissions={[0, 1, 3, 5]}>
        <title>Solicitudes de Pagos</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex justify-center ">
            <div className="w-12/12 bg-white my-14 mx-8">
              <div className="grid md:grid-cols-4 items-center justify-center my-5 gap-3">
                <div className="mx-auto">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() =>
                      Router.push({ pathname: "/solicitudeHistory" })
                    }
                  >
                    Ver Historial
                  </button>
                </div>
                <div className="mx-auto">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => Router.push({ pathname: "/beneficiary" })}
                  >
                    Beneficiarios
                  </button>
                </div>

                <div className="mx-auto">
                  <button
                    className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => Router.back()}
                  >
                    Volver
                  </button>
                </div>
              </div>
              <Button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                onClick={() =>
                  CheckPermissions(auth, [0, 1, 3])
                    ? Router.push({ pathname: "/solicitude/new" })
                    : toast.info("No puede ingresar solicitudes")
                }
              >
                Crear Solicitud
              </Button>
              <LoadingContainer visible={loading} miniVersion>
                <TreeTable
                  keyExpr="id"
                  dataSource={tableData}
                  columns={columns}
                  buttons={buttons}
                  searchPanel={true}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  buttonsFirst
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={15}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} solicitudes)`
                  }
                />
              </LoadingContainer>
              <ConfirmModal
                visible={itemToDelete !== null}
                close={() => setItemToDelete(null)}
                onDone={async () => {
                  await HttpClient(
                    "/api/solicitude/" + itemToDelete,
                    "DELETE",
                    auth.userName,
                    auth.role
                  );
                  hideConfirmModal();
                  await loadData();
                }}
              />

              <button
                className="bg-transparent m-5 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default SolicitudePage;
