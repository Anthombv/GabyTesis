import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Product, ResponseData, Sale } from "../../../model";
import FormatedDate from "../../../lib/utils/formated_date";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../../pages/components/tree_table";
import Sidebar from "../../../pages/components/sidebar";
import { useFormik } from "formik";
import NewProductModal from "../../../pages/components/modals/newProductModal";

const EditVenta = () => {
  const { auth } = useAuth();
  const [product, setProduct] = useState<Array<Product>>([]);
  const [editingFacture, setEditingFacture] = useState<Product | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [initialValues, setInitialValues] = useState<Sale>({
    quantity: 0,
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    saleDate: FormatedDate(),
    product: [],
    totalPrice: 0,
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/ventas/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setProduct(response.data.items);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (formData: Sale) => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;

      const requestData = {
        ...formData,
        id: solicitudeId,
      };
      const response: ResponseData = await HttpClient(
        "/api/ventas",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Solicitud editada correctamente!");
        await loadData();
      } else {
        toast.warning(response.message);
      }
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureId: string) => setItemToDelete(factureId);
  const hideConfirmModal = () => setItemToDelete(null);

  const columns: ColumnData[] = [
    {
      dataField: "category",
      caption: "Nombre",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "description",
      caption: "Fecha",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "name",
      caption: "Comentario",
      alignment: "left",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Product) => {
      setEditingFacture(rowData);
      showModal();
    },
    delete: (rowData: Product) => {
      showConfirmModal(rowData.id);
    },
  };

  const formik = useFormik<Sale>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });
  return (
    <>
      <title>Editar Solicitud</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>

        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-12/12 bg-white my-14 mx-8">
            <div className=" justify-center items-center my-4 text-center">
              <label className="text-gray-700 text-lg font-bold mx-4">
                Venta del cliente{" "}
                <em
                  style={{
                    color: "#bb22dd",
                    fontStyle: "normal",
                    fontSize: "18px",
                    fontFamily: "Arial Black",
                  }}
                >
                  {formik.values?.customer.name}
                </em>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                onClick={() => showModal()}
              >
                Agregar Productos
              </button>
              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                onClick={() => formik.handleSubmit()}
              >
                Actualizar Venta
              </button>
              <button
                className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-gray-500 hover:border-transparent rounded-full text-sm"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>

            <TreeTable
              dataSource={product}
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
              pageSize={20}
              infoText={(actual, total, items) =>
                `Página ${actual} de ${total} (${items} productos)`
              }
            />

            <NewProductModal
              visible={modalVisible}
              close={hideModal}
              initialData={editingFacture}
              onDone={(newItem: Product) => {
                if (editingFacture === null) {
                  setProduct((oldData) => [
                    ...oldData,
                    { ...newItem, id: `${oldData.length + 1}` },
                  ]);
                } else {
                    setProduct((oldData) =>
                    oldData.map((element: Product) =>
                      element.id === newItem.id ? newItem : element
                    )
                  );
                  setEditingFacture(null);
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditVenta;
