import React, { useEffect, useState } from "react";
import {
  ResponseData,
  Facture,
  Solicitude,
  Comment,
  CloudImage,
} from "../../../lib/types";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useFormik } from "formik";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import ConfirmModal from "../../../lib/components/modals/confirm";
import FactureModal from "../../../lib/components/modals/facture";
import LoadingContainer from "../../../lib/components/loading_container";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import ImageModal, {
  ImageModalProps,
} from "../../../lib/components/modals/image";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  CheckFinished,
  CheckPermissions,
} from "../../../lib/utils/check_permissions";
import TabContainer, { TabPanel } from "../../../lib/components/tab_container";
import SoliciterPanel from "../../../lib/layouts/edit_solicitude/soliciter";
import FinancialPanel from "../../../lib/layouts/edit_solicitude/financial";
import {
  Aprobado,
  Elaborando,
  Pendiente,
  Abierto,
} from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import FormatedDate from "../../../lib/utils/formated_date";
import ComentModal from "../../../lib/components/modals/coment";
import { useForm } from "react-hook-form";
import StatusSolicitude from "../status/[id]";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Sidebar from "../../../lib/components/sidebar";
import { alignPropType } from "react-bootstrap/esm/types";

// Inicio de la app
const EditFacture = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<Facture>>([]);
  const [initialValues, setInitialValues] = useState<Solicitude>({
    number: 0,
    soliciter: "",
    date: FormatedDate(),
    details: "",
    items: [],
    contableAdvanceState: Abierto,
    advanceState: Abierto,
    soliciterState: Elaborando,
    contableState: Pendiente,
    imageTreasuryState: Pendiente,
    paymentTreasuryState: Pendiente,
    financialState: Pendiente,
    applicantDate: FormatedDate(),
    accountantDate: FormatedDate(),
    contableAdvanceDate: FormatedDate(),
    advanceDate: FormatedDate(),
    treasuryDate: FormatedDate(),
    financialDate: FormatedDate(),
    imageTreasuryDate: FormatedDate(),
    itemsComment: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [itemCommentToDelete, setItemCommentToDelete] = useState<string>(null);
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setItems(response.data.items);
      setItemsComment(response.data.itemsComment);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: Solicitude) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const factureItems = await UploadSolicitudeImages(items);
      const requestData = {
        ...formData,
        itemsComment,
        items: factureItems,
        id: solicitudeId,
      };
      const response: ResponseData = await HttpClient(
        "/api/solicitude",
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
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const onClickSo = (data: any) => {
    fetch("/api/mailIC/mailSoli", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickCo = (data: any) => {
    fetch("/api/mailIC/mailConta", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickTe = (data: any) => {
    fetch("/api/mailIC/mailteso", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickFi = (data: any) => {
    fetch("/api/mailIC/mailFinan", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureId: string) => setItemToDelete(factureId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const showStatusModal = () => setStatusModal(true);

  const printSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/print/" + solicitudeId });
    } else {
      setTimeout(printSolicitude, 1000);
    }
  };

  const excelSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/excel/" + solicitudeId });
    } else {
      setTimeout(excelSolicitude, 1000);
    }
  };

  const txtPichincha = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/txt/" + solicitudeId });
    } else {
      setTimeout(txtPichincha, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/txtBGR/" + solicitudeId });
    } else {
      setTimeout(txtBGR, 1000);
    }
  };

  const columnsComent: ColumnData[] = [
    {
      dataField: "userComment",
      caption: "Nombre",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "dateComment",
      caption: "Fecha",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "messageComment",
      caption: "Comentario",
      alignment: "left",
      cssClass: "bold",
    },
  ];

  const buttonsComment = {
    edit: (rowData: Comment) => {
      setEditingComment(rowData);
      CheckPermissions(auth, [0])
        ? showModalComment()
        : toast.info("No puedes editar un comentario");
    },
    delete: async (rowData: Comment) => {
      CheckPermissions(auth, [0])
        ? showConfirmModalComment(rowData.id)
        : toast.info("No puedes borrar un comentario");
    },
  };

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitantes",
      content: <SoliciterPanel formik={formik} />,
    },
    {
      name: "Financiero",
      content: (
        <FinancialPanel formik={formik} items={items} setItems={setItems} />
      ),
    },
  ];

  const columns: ColumnData[] = [
    //Solicitante

    {
      dataField: "provider.name",
      caption: "Proveedor",
      cssClass: "column-soli",
    },
    {
      dataField: "provider.email",
      caption: "Email Prov",
      cssClass: "column-soli",
    },
    {
      dataField: "factureDate",
      caption: "Fecha de factura",
      cssClass: "column-soli",
    },
    {
      dataField: "factureNumber",
      caption: "Numero de Factura",
      cssClass: "column-soli",
    },
    {
      dataField: "details",
      caption: "Detalle",
      width: 250,
      cssClass: "column-soli",
    },
    {
      dataField: "value",
      caption: "Valor",
      cssClass: "column-soli",
    },
    {
      dataField: "observation",
      caption: "Observacion",
      cssClass: "column-soli",
      width: 250,
    },
    //Contabilidad
    {
      dataField: "documentDelivered",
      caption: "Documento",
      cssClass: "column-conta",
    },
    {
      dataField: "numberRetention",
      caption: "Numero de Retencion",
      cssClass: "column-conta",
    },
    {
      dataField: "valueRetention",
      caption: "Valor de Retencion",
      cssClass: "column-conta",
    },
    {
      dataField: "valueNet",
      caption: "Valor a Pagar",
      cssClass: "column-conta",
    },
    {
      dataField: "observationConta",
      caption: "Observacion de Contabilidad",
      cssClass: "column-conta",
    },
    //Tesoreria
    {
      dataField: "beneficiary",
      caption: "Beneficiario",
      cssClass: "column-teso",
    },
    {
      dataField: "identificationCard",
      caption: "Cedula o RUC",
      cssClass: "column-teso",
    },
    {
      dataField: "bank",
      caption: "Banco de Beneficiario",
      cssClass: "column-teso",
    },
    {
      dataField: "accountBank",
      caption: "Numero de Cuenta",
      cssClass: "column-teso",
    },
    {
      dataField: "accountType",
      caption: "Tipo de Cuenta",
      cssClass: "column-teso",
    },
    {
      dataField: "typeCard",
      caption: "Tipo de identificacion",
      cssClass: "column-teso",
      width: 80,
    },
    {
      dataField: "typePayments",
      caption: "Tipo de pago",
      cssClass: "column-teso",
    },
    {
      dataField: "numberCheck",
      caption: "Numero de Cheque",
      cssClass: "column-teso",
    },
    {
      dataField: "bankCheck",
      caption: "Banco del Cheque",
      cssClass: "column-teso",
    },
    {
      dataField: "discount",
      caption: "Descuento",
      cssClass: "column-teso",
    },
    {
      dataField: "increase",
      caption: "Aumento",
      cssClass: "column-teso",
    },
    {
      dataField: "observationTreasury",
      caption: "Observacion de Tesorería",
      cssClass: "column-teso",
    },
    //Financiero
    {
      dataField: "payments",
      caption: "Pago",
      cellRender: (params) => <FinanField finan={params.value} />,
      cssClass: "column-finan",
    },
    //Tesoreria 2
    {
      dataField: "accreditedPayment",
      caption: "Pago Acreditado",
      cssClass: "column-teso",
    },
    {
      dataField: "debitNote",
      caption: "Nota de debito",
      cssClass: "column-teso",
    },
    {
      dataField: "difference",
      caption: "Diferencia",
      cssClass: "column-teso",
    },
  ];

  const buttons = {
    edit: (rowData: Facture) => {
      setEditingFacture(rowData);
      showModal();
    },
    delete: (rowData: Facture) => {
      if (CheckPermissions(auth, [0])) {
        showConfirmModal(rowData.id);
      }
    },

    show: (rowData: Facture) => {
      if (
        (rowData.file as CloudImage)?.secure_url ||
        (rowData.treasuryFile as CloudImage)?.secure_url
      ) {
        setImageModal({
          title: rowData.details,
          image: (rowData.file as CloudImage)?.secure_url ?? "",
          treasuryImage: (rowData.treasuryFile as CloudImage)?.secure_url ?? "",
        });
      }
    },
  };

  return (
    <>
      <title>Editar Solicitud</title>

      <style>
        {`
        .highlight {
          background-color: yellow;
        }
        `}
      </style>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-12/12 bg-white my-14 mx-8">
            <div className="grid md:grid-cols-3 justify-center items-center my-4 text-center">
              <label className="text-gray-700 text-lg font-bold mx-4">
                Orden de Pago #{" "}
                <em
                  style={{
                    color: "#bb22dd",
                    fontStyle: "normal",
                    fontSize: "28px",
                    fontFamily: "Arial Black",
                  }}
                >
                  {formik.values?.number ?? 0}
                </em>
              </label>
              <div className="mr-4">
                <em
                  style={{
                    color: "#334155",
                    fontStyle: "normal",
                    fontSize: "24px",
                    fontFamily: "Lato",
                    fontWeight: "bold",
                  }}
                >
                  EDITAR{" "}
                </em>
                <em
                  style={{
                    color: "#94a3b8",
                    fontStyle: "normal",
                    fontSize: "24px",
                    fontFamily: "Lato",
                  }}
                >
                  SOLICITUD DE PAGO A PROVEEDORES
                </em>
              </div>
            </div>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-1 md:grid-cols-3 h-full m-4 gap-4 mb-4 text-center">
                <div>
                  {CheckPermissions(auth, [0, 3]) ? (
                    <SoliciterPanel formik={formik} />
                  ) : CheckPermissions(auth, [5]) ? (
                    <FinancialPanel
                      formik={formik}
                      items={items}
                      setItems={setItems}
                    />
                  ) : null}
                </div>
                <div className="mx-auto">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Solicitante"
                    value={formik.values?.soliciter ?? ""}
                    disabled
                  />
                </div>
                <div className="mx-auto">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Creación
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values?.date}
                    disabled
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Detalle General Solicitud
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Detalle General Solicitud"
                    value={formik.values?.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled={!CheckPermissions(auth, [0, 1])}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                  onClick={() =>
                    CheckPermissions(auth, [0, 3]) ||
                    !CheckFinished(
                      auth,
                      [3],
                      formik.values?.soliciterState,
                      "Aprobado"
                    )
                      ? showModal()
                      : toast.info("No tienes permiso para agregar un item")
                  }
                  disabled={CheckPermissions(auth, [2, 4, 5, 6])}
                >
                  Agregar Factura
                </button>
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                  onClick={() => formik.handleSubmit()}
                >
                  Actualizar Solicitud
                </button>
                <button
                  className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-1 my-3">
                <div className="relative inline-block text-center flex-auto w-48">
                  <button
                    type="button"
                    className="flex items-center justify-center w-full py-2 px-4 mx-8 font-semibold gap-x-1.5 text-red-500 bg-transparent border border-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full text-sm"
                    id="dropdown-toggle"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                  >
                    Descargar
                    <svg
                      className="-mr-1 h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="relative text-center w-40 mx-14  bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5">
                      {CheckPermissions(auth, [0, 1, 2, 3]) && (
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={printSolicitude}
                        >
                          PDF
                        </button>
                      )}
                      {CheckPermissions(auth, [0, 1]) && (
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={excelSolicitude}
                        >
                          EXCEL
                        </button>
                      )}
                      {CheckPermissions(auth, [0, 3, 6]) && (
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={txtPichincha}
                        >
                          CASH PICHINCHA
                        </button>
                      )}
                      {CheckPermissions(auth, [0, 3, 6]) && (
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={txtBGR}
                        >
                          CASH BGR
                        </button>
                      )}
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={showStatusModal}
                      >
                        ESTADO DE SOLICITUD
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                {CheckPermissions(auth, [0]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}

                <TreeTable
                  dataSource={items}
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
                  pageSize={50}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} facturas)`
                  }
                />
              </div>

              <FactureModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFacture}
                onDone={(newItem: Facture) => {
                  if (editingFacture === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: Facture) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                    setEditingFacture(null);
                  }
                }}
              />

              <StatusSolicitude
                visible={statusModal}
                close={() => setStatusModal(!statusModal)}
              />

              <ComentModal
                visible={commentModalVisible}
                close={() => setCommentModalVisible(!commentModalVisible)}
                initialData={editingComment}
                onDone={(newItemComment: Comment) => {
                  if (editingComment === null) {
                    setItemsComment((oldData) => [
                      ...oldData,
                      { ...newItemComment, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItemsComment((oldData) =>
                      oldData.map((element: Comment) =>
                        element.id === newItemComment.id
                          ? newItemComment
                          : element
                      )
                    );
                    setEditingComment(null);
                  }
                }}
              />

              <ConfirmModal
                visible={itemToDelete !== null}
                close={() => setItemToDelete(null)}
                onDone={() => {
                  setItems((oldData) => [
                    ...oldData.filter(
                      (item: Facture) => item.id !== itemToDelete
                    ),
                  ]);
                  hideConfirmModal();
                }}
              />

              <ConfirmModal
                visible={itemCommentToDelete !== null}
                close={() => setItemCommentToDelete(null)}
                onDone={() => {
                  setItemsComment((oldData) => [
                    ...oldData.filter(
                      (item: Comment) => item.id !== itemCommentToDelete
                    ),
                  ]);
                  hideConfirmModalComment();
                }}
              />

              <ImageModal
                visible={imageModal !== null}
                close={() => setImageModal(null)}
                {...imageModal}
              />
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditFacture;
