import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import UserModal from "../../../components/modals/user";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { ResponseData, User } from "../../../../model";
import { useAuth } from "../../../../lib/hooks/use_auth";
import HttpClient from "../../../../lib/utils/http_client";

const UsersPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<User>>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/user",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const users: Array<any> = response.data;
      setTableData(users);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingUser != null) setEditingUser(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del empleado",
    },
    {
      dataField: "userName",
      caption: "Usuario",
    },
    {
      dataField: "email",
      caption: "E-mail",
    },
    {
      dataField: "identificationCard",
      caption: "Cedula o RUC",
    },
    {
      dataField: "department",
      caption: "Departamento",
    },
    {
      dataField: "position",
      caption: "Cargo o Puesto",
    },
    {
      dataField: "role",
      caption: "Rol",
      cellRender: ({ text }: any) => {
        switch (text) {
          case "0":
            return "Administrador";
          case "1":
            return "Ventas";
          case "2":
            return "Jefe de ventas";
          case "3":
            return "Contabilidad";
          case "4":
            return "Gerente";
          case "5":
            return "Financiero";
          default:
            return "";
        }
      },
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingUser(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      await HttpClient(
        "/api/user/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      toast.success("Usuario eliminado");
      await loadData();
    },
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
        onClick={showModal}
      >
        Crear Usuario
      </button>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          dataSource={tableData}
          columns={columns}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} Usuarios)`
          }
        />
      </LoadingContainer>
      <UserModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingUser}
        onDone={async (newUser: User) => {
          console.log(newUser);
          const response: ResponseData =
            editingUser == null
              ? await HttpClient(
                  "/api/user",
                  "POST",
                  auth.userName,
                  auth.role,
                  newUser
                )
              : await HttpClient(
                  "/api/user",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newUser
                );
          if (response.success) {
            toast.success(
              editingUser == null ? "Usuario creado!" : "Usuario actualizado!"
            );
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </div>
  );
};

export default UsersPanel;
