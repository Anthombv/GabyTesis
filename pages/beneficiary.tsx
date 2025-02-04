import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../pages/components/loading_container";
import ClientModal from "../pages/components/modals/beneficiarios";
import TreeTable, { ColumnData } from "../pages/components/tree_table";
import { useAuth } from "../lib/hooks/use_auth";
import { Beneficiary, ResponseData } from "../model";
import HttpClient from "../lib/utils/http_client";
import Sidebar from "../pages/components/sidebar";
import Router from "next/router";
import { CheckPermissions } from "../lib/utils/check_permissions";
import RoleLayout from "../pages/layouts/role_layout";

const BeneficiaryPage = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Beneficiary>>([]);
  const [editingBeneficiary, setEditingBeneficiary] =
    useState<Beneficiary | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/beneficiarios",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const clients: Array<Beneficiary> = response.data;
      setTableData(clients);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  const columns: ColumnData[] = [
    {
      dataField: "beneficiary",
      caption: "Beneficiario",
    },
    {
      dataField: "identificationCard",
      caption: "# Cédula o RUC",
    },
    {
      dataField: "bank",
      caption: "Banco",
    },
    {
      dataField: "accountBank",
      caption: "# Cuenta",
    },
    {
      dataField: "accountType",
      caption: "Tipo Cuenta",
      width: 80,
      alignment: "center",
    },
    {
      dataField: "codBank",
      caption: "Cod Banco",
      width: 80,
      alignment: "center",
    },
    {
      dataField: "typeCard",
      caption: "Tipo de identificacion",
      width: 80,
      alignment: "center",
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingBeneficiary != null) setEditingBeneficiary(null);
    setModalVisible(false);
    await loadData();
  };

  const buttons = {
    edit: (rowData: any) => {
      setEditingBeneficiary(rowData);
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

  return (
    <>
      <RoleLayout permissions={[0, 1]}>
        <title>Beneficiarios</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-12/12 bg-white my-14 mx-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <LoadingContainer visible={loading} miniVersion>
                  {/* <h3 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    Beneficiarios
                  </h3> */}
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
                      BENEFI
                    </em>
                    <em
                      style={{
                        color: "#94a3b8",
                        fontStyle: "normal",
                        fontSize: "24px",
                        fontFamily: "Lato",
                      }}
                    >
                      CIARIOS
                    </em>
                  </p>
                  <div>
                    <button
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                      onClick={showModal}
                      disabled={!CheckPermissions(auth, [0, 1])}
                    >
                      Crear Beneficiario
                    </button>
                    <button
                      className="text-center bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 ml-2 border border-gray-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => Router.back()}
                    >
                      Volver
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
                </LoadingContainer>
              </div>
              <button
                className="bg-transparent m-5 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
        <ClientModal
          visible={modalVisible}
          close={hideModal}
          initialData={editingBeneficiary}
          onDone={async (newUser: Beneficiary) => {
            const response: ResponseData =
              editingBeneficiary == null
                ? await HttpClient(
                    "/api/beneficiarios",
                    "POST",
                    auth.userName,
                    auth.role,
                    newUser
                  )
                : await HttpClient(
                    "/api/beneficiarios",
                    "PUT",
                    auth.userName,
                    auth.role,
                    newUser
                  );
            if (response.success) {
              toast.success(
                editingBeneficiary == null
                  ? "Beneficiario creado!"
                  : "Beneficiario actualizado!"
              );
            } else {
              toast.warning(response.message);
            }
          }}
        />
      </RoleLayout>
    </>
  );
};
export default BeneficiaryPage;
