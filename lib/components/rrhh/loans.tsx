import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";
import { useAuth } from "../../hooks/use_auth";
import { Loan } from "../../types";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../tree_table";
import { StateField } from "../../styles/views/indexStyled";
import { Pendiente } from "../../utils/constants";
import { CheckPermissions } from "../../utils/check_permissions";
import RoleLayout from "../../layouts/role_layout";
import LoadingContainer from "../loading_container";
import ConfirmModal from "../modals/confirm";
import GeneralReportLoanModal from "../modals/generalReportLoan";

const Loans = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Loan>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/loan",
      "GET",
      auth.userName,
      auth.role
    );
    const loans: Array<Loan> = response.data ?? [];
    setTableData(loans);
    setLoading(false);
  };

  const showModal = () => setModalVisible(true);

  const showConfirmModal = (loanId: string) => setItemToDelete(loanId);
  const hideConfirmModal = () => setItemToDelete(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 300,
    },
    {
      dataField: "details",
      caption: "Departamento",
      cssClass: "bold",
    },
    {
      dataField: "requestedHour",
      caption: "Cargo",
      cssClass: "bold",
    },
    {
      dataField: "requestedDays",
      caption: "Prestamo",
      cssClass: "bold",
    },
    {
      dataField: "typePermissions",
      caption: "Tipo de prestamos",
      cssClass: "bold",
    },
    {
      dataField: "dateS",
      caption: "Periodo",
      cssClass: "bold",
    },
    {
      dataField: "dateE",
      caption: "Mes de cobro",
      cssClass: "bold",
    },
    {
      dataField: "state",
      caption: "Estado",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      cssClass: "bold",
      alignment: "center",
    },
  ];

  const buttons = {
    edit: (rowData: Loan) =>
      CheckPermissions(auth, [0, 10, 33])
        ? Router.push({
            pathname: "/loan/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes aceeer"),
    delete: async (rowData: Loan) => {
      CheckPermissions(auth, [0, 2])
        ? showConfirmModal(rowData.id)
        : toast.error(
            "No puedes eliminar un prestamo, comuniquese con el administrador"
          );
    },

    //download: (rowData: Loan) =>
    //  CheckPermissions(auth, [0, 2])
    //    ? Router.push({
    //        pathname: "loan/print/" + (rowData.id as string),
    //      })
    //    : toast.error("No puedes acceder"),
  };

  return (
    <>
      <RoleLayout permissions={[0, 10, 33]}>
        <title>Prestamos</title>
        <LoadingContainer visible={loading} miniVersion>
          <h1 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
            SOLICITUDES DE PRESTAMOS
          </h1>
          <button
            className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
            onClick={showModal}
          >
            Reporte General
          </button>
          <div style={{ margin: "20px", marginBottom: "3em" }}>
            <TreeTable
              keyExpr="id"
              columns={columns}
              dataSource={tableData}
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
                `Página ${actual} de ${total} (${items} prestamos)`
              }
            />
          </div>

          <button
            className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
            onClick={() => Router.push({ pathname: "/loansHistory" })}
          >
            Historial de Prestamos
          </button>

          <ConfirmModal
            visible={itemToDelete !== null}
            close={() => setItemToDelete(null)}
            onDone={async () => {
              await HttpClient(
                "/api/loan/" + itemToDelete,
                "DELETE",
                auth.userName,
                auth.role
              );
              hideConfirmModal();
              await loadData();
            }}
          />

          <GeneralReportLoanModal
            visible={modalVisible}
            close={() => {
              setModalVisible(null);
            }}
          />
        </LoadingContainer>
      </RoleLayout>
    </>
  );
};
export default Loans;
