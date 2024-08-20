import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/use_auth";
import { Product, ResponseData } from "../lib/types";
import Sidebar from "../lib/components/sidebar";
import LoadingContainer from "../lib/components/loading_container";
import TreeTable, { ColumnData } from "../lib/components/tree_table";
import { Button } from "react-bootstrap";
import { CheckPermissions } from "../lib/utils/check_permissions";
import HttpClient from "../lib/utils/http_client";
import { toast } from "react-toastify";
import ProductModal from "../lib/components/modals/productModal";

const InventarioPage = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Product>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/product",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const product: Array<Product> = response.data;
      setTableData(product);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "price",
      caption: "Precio",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "stock",
      caption: "Inventario",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "description",
      caption: "Descripción",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "category",
      caption: "Categoría",
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingProduct != null) setEditingProduct(null);
    setModalVisible(false);
    await loadData();
  };
  return (
    <>
      <title>Inventario de productos</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex justify-center ">
          <div className="w-12/12 bg-white my-14 mx-8 p-5">
            <h2 className="text-2xl text-center mt-10 font-bold">
              Inventario de productos
            </h2>
            <button
              className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
              onClick={showModal}
            >
              Agregar Producto
            </button>

            <LoadingContainer visible={loading} miniVersion>
              <TreeTable
                keyExpr="id"
                dataSource={tableData}
                columns={columns}
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
          </div>
        </div>
      </div>

      <ProductModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingProduct}
        onDone={async (newUser: Product) => {
          const response: ResponseData =
            editingProduct == null
              ? await HttpClient(
                  "/api/product",
                  "POST",
                  auth.userName,
                  auth.role,
                  newUser
                )
              : await HttpClient(
                  "/api/product",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newUser
                );
          if (response.success) {
            toast.success(
              editingProduct == null
                ? "Producto creado!"
                : "Producto actualizado!"
            );
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </>
  );
};

export default InventarioPage;
