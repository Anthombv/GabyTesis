import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use_auth";
import { Permission } from "../../types";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../tree_table";
import { StateField } from "../../styles/views/indexStyled";
import { Pendiente } from "../../utils/constants";
import { CheckPermissions } from "../../utils/check_permissions";
import Router from "next/router";
import { toast } from "react-toastify";
import RoleLayout from "../../layouts/role_layout";
import styles from "../../../styles/Home.module.css";
import LoadingContainer from "../loading_container";
import ConfirmModal from "../modals/confirm";

const Permisos = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Permission>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/permission",
      "GET",
      auth.userName,
      auth.role
    );
    const permissions: Array<Permission> = response.data ?? [];
    setTableData(permissions);
    setLoading(false);
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = () => setItemToDelete(null);
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
      width: 60,
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
      width: 300,
    },
    {
      dataField: "typePermissions",
      caption: "Tipo de permiso",
      cssClass: "bold",
      width: 200,
    },
    {
      dataField: "details",
      caption: "Detalle",
      minWidth: 400,
      cssClass: "bold",
    },
    {
      dataField: "requestedHour",
      caption: "Total Horas",
      cssClass: "bold",
      alignment: "center",
      width: 60,
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
    edit: (rowData: Permission) =>
      CheckPermissions(auth, [0, 10, 33])
        ? Router.push({
            pathname: "/permission/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: async () => {
      CheckPermissions(auth, [0])
        ? showConfirmModal()
        : toast.error("No puedes eliminar una Solicitud");
    },
    //download: (rowData: Permission) =>
    //  CheckPermissions(auth, [0, 2])
    //    ? Router.push({
    //        pathname: "/permission/print/" + (rowData.id as string),
    //      })
    //    : toast.error("No puedes acceder"),
  };

  return (
    <>
      <RoleLayout permissions={[0, 10, 33]}>
        <title>Permisos</title>
          <LoadingContainer visible={loading} miniVersion>
              <h1 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                SOLICITUDES DE PERMISOS
              </h1>
              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
                onClick={() => Router.push("/permission/generalReport")}
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
                    `Página ${actual} de ${total} (${items} permisos)`
                  }
                />
              </div>

              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
                onClick={() => Router.push({ pathname: "/permissionHistory" })}
              >
                Historial de Permisos
              </button>

            <ConfirmModal
              visible={itemToDelete !== null}
              close={() => setItemToDelete(null)}
              onDone={async () => {
                await HttpClient(
                  "/api/permission/" + itemToDelete,
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

export default Permisos;
