import Router from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../tree_table";
import { StateField } from "../../styles/views/indexStyled";
import { Pendiente } from "../../utils/constants";
import { CheckPermissions } from "../../utils/check_permissions";
import RoleLayout from "../../layouts/role_layout";
import LoadingContainer from "../loading_container";
import ConfirmModal from "../modals/confirm";
import { Holidays } from "../../types";
import GeneralReportHolidaysModal from "../modals/generalReportholidays";

// Inicio de la app
const Vacation = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Holidays>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/holidays",
      "GET",
      auth.userName,
      auth.role
    );
    const solicitudes: Array<Holidays> = response.data ?? [];
    console.log(solicitudes);
    setTableData(solicitudes);
    setLoading(false);
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (solicitudeId: string) =>
    setItemToDelete(solicitudeId);
  const hideConfirmModal = () => setItemToDelete(null);

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "date",
      caption: "Fecha de Registro",
      cssClass: "bold",
      width: 150,
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 280,
    },
    {
      dataField: "typePermissions",
      caption: "Tipo de permiso",
      cssClass: "bold",
      width: 160,
    },
    {
      dataField: "details",
      caption: "Detalle",
      width: 300,
      cssClass: "bold",
    },
    {
      dataField: "requestedDays",
      caption: "Total Dias",
      cssClass: "bold",
    },
    {
      dataField: "state",
      caption: "Solicitante",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      minWidth: 100,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Holidays) =>
      CheckPermissions(auth, [0, 10, 33])
        ? Router.push({
            pathname: "/holidays/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: (rowData: Holidays) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar una Solicitud");
    },
     
  };
  const handleHistory = () => {
    Router.push({ pathname: "/holidaysHistory" })
  }

  return (
    <>
      <RoleLayout permissions={[0, 10, 33]}>
        <title>Vacaciones</title>

        <LoadingContainer visible={loading} miniVersion>
          <h1 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
            SOLICITUDES DE VACACIONES
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
                `Página ${actual} de ${total} (${items} vacaciones)`
              }
            />
          </div>
          <div>
            <button
              className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
              onClick={handleHistory}
            >
              Historial de Vacaciones
            </button>
          </div>

          <GeneralReportHolidaysModal
              visible={modalVisible}
              close={() => {
                setModalVisible(null);
              }}
            />

          <ConfirmModal
            visible={itemToDelete !== null}
            close={() => setItemToDelete(null)}
            onDone={async () => {
              await HttpClient(
                "/api/holidays/" + itemToDelete,
                "DELETE",
                auth.userName,
                auth.role
              );
              hideConfirmModal();
              await loadData();
            }}
          />
        </LoadingContainer>
      </RoleLayout>
    </>
  );
};
export default Vacation;
