import Router from "next/router";
import Sidebar from "../pages/components/sidebar";
import RoleLayout from "../pages/layouts/role_layout";
import { CheckPermissions } from "../lib/utils/check_permissions";
import { useAuth } from "../lib/hooks/use_auth";
import { useEffect, useState } from "react";
import { Product, ResponseData, Sale } from "../model";
import TreeTable, { ColumnData } from "../pages/components/tree_table";
import HttpClient from "../lib/utils/http_client";
import VentasModal from "../pages/components/modals/ventasModal";
import { toast } from "react-toastify";

const Ventas = () => {
  const { auth } = useAuth();
  const [tableData, setTableData] = useState<Array<Sale>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingSale != null) setEditingSale(null);
    setModalVisible(false);
    await loadData();
  };

  const loadData = async () => {
    const response = await HttpClient(
      "/api/ventas",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const ventas: Array<Sale> = response.data;
      setTableData(ventas);
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
      dataField: "saleDate",
      caption: "Fecha de la venta",
    },
    {
      dataField: "customer.name",
      caption: "Nombre",
    },
    {
      dataField: "customer.email",
      caption: "Email del cliente",
    },
    {
      dataField: "customer.phone",
      caption: "Telefono del cliente",
    },
    {
      dataField: "totalPrice",
      caption: "Valor Total",
      cellRender: (params) => {
        const factures: Array<Product> = params.value;
        let total = 0;
        if (factures?.length > 0)
          factures?.forEach((item: Product) => {
            total += item.price ?? 0;
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
  ];

  const buttons = {
    edit: (rowData: any) => {
      Router.push({
        pathname: "/ventas/edit/" + (rowData.id as string),
      })
    },
    delete: async (rowData: any) => {
      await HttpClient(
        "/api/ventas/" + rowData.id,
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
        <title>Ventas</title>
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
                    VEN
                  </em>
                  <em
                    style={{
                      color: "#94a3b8",
                      fontStyle: "normal",
                      fontSize: "24px",
                      fontFamily: "Lato",
                    }}
                  >
                    TAS
                  </em>
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={showModal}
                    disabled={!CheckPermissions(auth, [0, 1])}
                  >
                    Registrar nueva venta
                  </button>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={handleAppClientes}
                  >
                    Clientes
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

      <VentasModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingSale}
        onDone={async (newUser: Sale) => {
          const response: ResponseData =
            editingSale == null
              ? await HttpClient(
                  "/api/ventas",
                  "POST",
                  auth.userName,
                  auth.role,
                  newUser
                )
              : await HttpClient(
                  "/api/ventas",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newUser
                );
          if (response.success) {
            toast.success(
              editingSale == null ? "Venta creada!" : "Venta actualizada!"
            );
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </>
  );
};
export default Ventas;
