import Router from "next/router";
import Sidebar from "../pages/components/sidebar";
import RoleLayout from "../pages/layouts/role_layout";
import { CheckPermissions } from "../lib/utils/check_permissions";
import { useAuth } from "../lib/hooks/use_auth";
import { useEffect, useState } from "react";
import { Customer, ResponseData, Sale } from "../model";
import TreeTable, { ColumnData } from "../pages/components/tree_table";
import HttpClient from "../lib/utils/http_client";
import ClientesModal from "../pages/components/modals/clientesModal";
import { toast } from "react-toastify";

const ClientesPage = () => {
  const { auth } = useAuth();
  const [tableData, setTableData] = useState<Array<Customer>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingClientes, setEditingClientes] = useState<Customer | null>(null);
  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingClientes != null) setEditingClientes(null);
    setModalVisible(false);
    await loadData();
  };

  const loadData = async () => {
    const response = await HttpClient(
      "/api/client",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const clients: Array<Customer> = response.data;
      setTableData(clients);
    } else {
      toast.warning(response.message);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre",
    },
    {
      dataField: "email",
      caption: "Correo",
    },
    {
      dataField: "phone",
      caption: "Telefono",
    },
    {
      dataField: "address",
      caption: "Direccion",
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingClientes(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      await HttpClient(
        "/api/client/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  const handleAppClientes = () => {
    Router.push({ pathname: "/clientes" });
  };

  return (
    <>
      <RoleLayout permissions={[0, 4, 5]}>
        <title>Clientes</title>
        <div className="flex h-screen">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-12/12 bg-white my-14 mx-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <p className="my-4    text-center">
                  <em
                    style={{
                      color: "#334155",
                      fontStyle: "normal",
                      fontSize: "24px",
                      fontFamily: "Lato",
                      fontWeight: "bold",
                    }}
                  >
                    CLIEN
                  </em>
                  <em
                    style={{
                      color: "#94a3b8",
                      fontStyle: "normal",
                      fontSize: "24px",
                      fontFamily: "Lato",
                    }}
                  >
                    TES
                  </em>
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={showModal}
                    disabled={!CheckPermissions(auth, [0, 1])}
                  >
                    Registrar nuevo cliente
                  </button>
                </div>
                <TreeTable
                  dataSource={tableData}
                  columns={columns}
                  buttons={buttons}
                  buttonsFirst
                  searchPanel={true}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={20}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} beneficiarios)`
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </RoleLayout>

      <ClientesModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingClientes}
        onDone={async (newUser: Customer) => {
          const response: ResponseData =
            editingClientes == null
              ? await HttpClient(
                  "/api/client",
                  "POST",
                  auth.userName,
                  auth.role,
                  newUser
                )
              : await HttpClient(
                  "/api/client",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newUser
                );
          if (response.success) {
            toast.success(
              editingClientes == null
                ? "Cliente creado!"
                : "Cliente actualizado!"
            );
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </>
  );
};
export default ClientesPage;
