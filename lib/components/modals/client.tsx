import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { Beneficiary, ModalProps, ResponseData } from "../../types";
import HttpClient from "../../utils/http_client";
import LoadingContainer from "../loading_container";

const initialClient: Beneficiary = {
  beneficiary: "",
  identificationCard: "",
  bank: "",
  accountBank: "",
  accountType: "",
  accountTypeB: "",
  codBank: "",
  typeCard: "",
};

interface Props extends ModalProps<Beneficiary> {
  initialData?: Beneficiary;
}

const ClientModal = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Beneficiary>(initialClient);
  const [banks, setBanks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const loadBanks = async () => {
    const response: ResponseData = await HttpClient(
      "/api/bank/",
      "GET",
      auth.userName,
      auth.role
    );
    setBanks(response.data ?? []);
  };

  const OnSuggestHandler = (text: string, field: string) => {
    formik.setFieldValue(field, text);
    setSuggestions([]);
  };

  const onChangeHandler = (
    text: string,
    field: string,
    suggestions: Array<any>,
    name: boolean = true
  ) => {
    let matches = [];
    if (text.length > 0) {
      matches = suggestions.filter((element) => {
        const regex = new RegExp(`${text}`, "gi");
        return name ? element.name.match(regex) : element.bank.match(regex);
      });
    }
    setSuggestions(matches);
    formik.setFieldValue(field, text);
  };

  const handleClose = () => {
    formik.resetForm({ values: initialClient });
    props.close();
  };

  const getDocumentType = (identificationCard: string) => {
    const idLength = identificationCard.length;
    if (idLength === 10) {
      return "C";
    } else if (idLength === 13) {
      return "R";
    }
    return "";
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Beneficiary) => {
      if (formData.beneficiary === "") {
        toast.warning("El nombre del beneficiario no puede estar vacio");
        return;
      }
      if (formData.identificationCard === "") {
        toast.warning("El numero de cedula no puede estar vacio");
        return;
      }
      if (formData.bank === "") {
        toast.warning("El banco del beneficiario no puede estar vacio");
        return;
      }
      if (formData.accountBank === "") {
        toast.warning("El numero de cuenta no puede estar vacio");
        return;
      }
      if (formData.accountType === "") {
        toast.warning("El tipo de cuenta no puede estar vacio");
        return;
      }
      if (formData.codBank === "") {
        toast.warning("El codigo del banco no puede estar vacio");
        return;
      }
      const documentType = getDocumentType(formData.identificationCard);
      if (!documentType) {
        toast.warning("El numero de cedula o RUC es invalido");
        return;
      }
      setLoading(true);
      await props.onDone({ ...formData, typeCard: documentType });
      setLoading(false);
      handleClose();
    },
  });
  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
  }, [props.initialData]);

  useEffect(() => {
    loadBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-1/3 w-5/6 md:h-4/6 overflow-y-auto">
          <form onSubmit={formik.handleSubmit}>
            {/* <div
              style={{ color: theme.colors.red }}
              className="text-center text-xl mb-2 font-semibold"
            >
              Crear nuevo Beneficiario
            </div> */}
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
              NUEVO {" "}
              </em>  
              <em
                style={{
                  color: "#94a3b8",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato"
                }}
              >
              BENEFICIARIO
              </em>              
            </p>
            <hr />
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3 my-6">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    * Nombre de Beneficiario
                  </label>

                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Apellido y Nombre"
                    name="beneficiary"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "beneficiary",
                        e.target.value.toUpperCase()
                      )
                    }
                    value={formik.values.beneficiary}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    * Cedula o RUC
                  </label>

                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Ingrese cedula o RUC de beneficiario"
                    name="identificationCard"
                    onChange={formik.handleChange}
                    value={formik.values.identificationCard}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    * Banco
                  </label>

                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Ingrese el banco del beneficiario"
                    value={formik.values?.bank}
                    onChange={(e) =>
                      onChangeHandler(e.target.value, "bank", banks, false)
                    }
                  />
                  {suggestions &&
                    suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          OnSuggestHandler(suggestion.bank, "bank");
                          formik.setFieldValue("codBank", suggestion.codBank);
                        }}
                      >
                        {suggestion.bank}
                      </div>
                    ))}
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    * Número de Cuenta
                  </label>

                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Ingrese el número de cuenta"
                    name="accountBank"
                    onChange={formik.handleChange}
                    value={formik.values.accountBank}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    * Tipo de Cuenta
                  </label>

                  <select
                    className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="accountType"
                    onChange={formik.handleChange}
                    value={formik.values.accountType}
                  >
                    <option>Seleccion un tipo de cuenta</option>
                    <option value="AHO">AHO</option>
                    <option value="CC">CC</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-semibold mb-2">
                    Código del Banco
                  </label>

                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Ingrese el codigo del banco"
                    name="codBank"
                    onChange={formik.handleChange}
                    value={formik.values.codBank}
                    disabled
                  />
                </div>
              </div>
            </LoadingContainer>

            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent mb-4 rounded-full text-sm"
              type="submit"
            >
              Guardar Beneficiario
            </button>
          </form>
          <button
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientModal;
