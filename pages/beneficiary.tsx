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
      "/api/beneficiary",
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

  const validar = () => {
    var cad = (document.getElementById("ced") as HTMLInputElement).value.trim();
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;

    if (cad !== "" && longitud === 10) {
      for (let i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = parseInt(cad.charAt(i)) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }

      total = total % 10 ? 10 - (total % 10) : 0;

      if (parseInt(cad.charAt(longitud - 1)) == total) {
        document.getElementById("salida").innerHTML = "Cedula correcta!!!";
      } else {
        document.getElementById("salida").innerHTML =
          "Cedula Inválida  REVISAR...";
      }
    }
  };

  const validarRUC = () => {
    var number = (
      document.getElementById("ruc") as HTMLInputElement
    ).value.trim();
    var dto = number.length;
    var valor;
    var acu = 0;
    if (number == "") {
      document.getElementById("salida2").innerHTML =
        "No has ingresado ningún dato, porfavor ingresar los datos correspondientes.";
    } else {
      for (var i = 0; i < dto; i++) {
        valor = number.substring(i, i + 1);
        if (
          valor == 0 ||
          valor == 1 ||
          valor == 2 ||
          valor == 3 ||
          valor == 4 ||
          valor == 5 ||
          valor == 6 ||
          valor == 7 ||
          valor == 8 ||
          valor == 9
        ) {
          acu = acu + 1;
        }
      }
      if (acu == dto) {
        while (number.substring(10, 13) !== "001") {
          document.getElementById("salida2").innerHTML =
            "Los tres últimos dígitos no tienen el código del RUC 001.";
          return;
        }
        while (parseInt(number.substring(0, 2)) > 24) {
          document.getElementById("salida2").innerHTML =
            "Los dos primeros dígitos no pueden ser mayores a 24.";
          return;
        }
        var porcion1 = number.substring(2, 3);
        if (parseInt(porcion1) < 6) {
          document.getElementById("salida2").innerHTML =
            "El RUC está escrito correctamente. El tercer dígito es menor a 6, por lo \ntanto el usuario es una persona natural.\n";
        } else {
          if (parseInt(porcion1) == 6) {
            document.getElementById("salida2").innerHTML =
              "El RUC está escrito correctamente. El tercer dígito es igual a 6, por lo \ntanto el usuario es una entidad pública.\n";
          } else {
            if (parseInt(porcion1) == 9) {
              document.getElementById("salida2").innerHTML =
                "El RUC está escrito correctamente. El tercer dígito es igual a 9, por lo \ntanto el usuario es una sociedad privada.\n";
            }
          }
        }
      } else {
        alert("ERROR: Por favor no ingrese texto");
      }
    }
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        className="appearance-none my-3 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        type="text"
                        placeholder="Ingrese la cedula para validar..."
                        id="ced"
                        maxLength={10}
                      />
                      <button
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                        type="button"
                        name="button"
                        onClick={validar}
                      >
                        Validar Cedula
                      </button>
                      <div id="salida"></div>
                    </div>
                    <div>
                      <input
                        className="appearance-none my-3 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        type="text"
                        placeholder="Ingrese el RUC para validar..."
                        name="dato"
                        id="ruc"
                        maxLength={13}
                      />
                      <button
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                        type="button"
                        value="Validar RUC"
                        onClick={validarRUC}
                      >
                        Validar RUC
                      </button>
                      <div id="salida2"></div>
                    </div>
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
                    "/api/beneficiary",
                    "POST",
                    auth.userName,
                    auth.role,
                    newUser
                  )
                : await HttpClient(
                    "/api/beneficiary",
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
