import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { FactureAdvanceCalderon, ModalProps, ResponseData } from "../../types";
import { CheckPermissions } from "../../utils/check_permissions";
import HttpClient from "../../utils/http_client";

const initialFactureAdvance: FactureAdvanceCalderon = {
  id: null,
  //Solicitante
  project: {
    name: "CALDERON",
  },
  centerCost: {
    name: "",
    projectId: "",
  },
  centerCostIg: {
    name: "",
  },
  centerCostCalderon: {
    name: "",
  },
  centerCostBalcon: {
    name: "",
  },
  provider: {
    name: "",
    email: "",
  },
  providerIg: {
    name: "",
    emailIg: "",
  },
  providerCalderon: {
    name: "",
    emailCalderon: "",
  },
  providerBalcon: {
    name: "",
    emailBalcon: "",
  },
  providerRecaudaciones: {
    name: "",
    emailRecaudaciones: "",
  },
  email: {
    name: "",
    email: "",
  },
  factureDate: "",
  factureNumber: 0,
  details: "",
  value: 0,
  file: null,
  observation: "",
  typeCard: "",
  codBank: "",
  typeProv: "",
  //Contabilidad
  numberRetention: 0,
  valueRetention: 0,
  valueNet: 0,
  documentDelivered: "",
  closingSeat: "",
  observationConta: "",
  //Tesoreria
  beneficiary: "",
  identificationCard: "",
  bank: "",
  accountBank: "",
  accountType: "",
  accountTypeB: "",
  numberCheck: "",
  bankCheck: "",
  discount: 0,
  increase: 0,
  observationTreasury: "",
  //Financiero
  payments: "",
  typePayments: "",
  //tesoreria 2
  difference: 0,
  accreditedPayment: 0,
  debitNote: "",
};

interface Props extends ModalProps<FactureAdvanceCalderon> {
  initialData?: FactureAdvanceCalderon;
}

const FactureAdvanceCalderonModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<FactureAdvanceCalderon>(
    initialFactureAdvance
  );
  const [image, setImage] = useState<File>(null);
  const [treasuryImage, setTreasuryImage] = useState<File>(null);
  const [providers, setProviders] = useState([]);
  const [centers, setCenters] = useState([]);
  const [clients, setClients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsCC, setSuggestionsCC] = useState([]);
  const [suggestionsP, setSuggestionsP] = useState([]);

  const loadClients = async () => {
    const response: ResponseData = await HttpClient(
      "/api/client/",
      "GET",
      auth.userName,
      auth.role
    );
    setClients(response.data ?? []);
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
        return name
          ? element.name.match(regex)
          : element.beneficiary.match(regex);
      });
    }
    setSuggestions(matches);
    formik.setFieldValue(field, text);
  };

  const OnSuggestHandlerCC = (text: string, field: string) => {
    formik.setFieldValue(field, text);
    setSuggestionsCC([]);
  };

  const onChangeHandlerCC = (
    text: string,
    field: string,
    suggestions: Array<any>,
    name: boolean = true
  ) => {
    let matches = [];
    if (text.length > 0) {
      matches = suggestions.filter((element) => {
        const regex = new RegExp(`${text}`, "gi");
        return name
          ? element.name.match(regex)
          : element.beneficiary.match(regex);
      });
    }
    setSuggestionsCC(matches);
    formik.setFieldValue(field, text);
  };

  const OnSuggestHandlerP = (text: string, field: string) => {
    formik.setFieldValue(field, text);
    setSuggestionsP([]);
  };

  const onChangeHandlerP = (
    text: string,
    field: string,
    suggestions: Array<any>,
    name: boolean = true
  ) => {
    let matches = [];
    if (text.length > 0) {
      matches = suggestions.filter((element) => {
        const regex = new RegExp(`${text}`, "gi");
        return name
          ? element.name.match(regex)
          : element.beneficiary.match(regex);
      });
    }
    setSuggestionsP(matches);
    formik.setFieldValue(field, text);
  };

  const loadProviders = async () => {
    const response: ResponseData = await HttpClient(
      "/api/providerCalderon/",
      "GET",
      auth.userName,
      auth.role
    );
    setProviders(response.data ?? []);
  };

  const loadCenters = async () => {
    const response: ResponseData = await HttpClient(
      "/api/centro_costosCalderon/",
      "GET",
      auth.userName,
      auth.role
    );
    setCenters(response.data ?? []);
  };

  const handleClose = () => {
    formik.resetForm({ values: initialFactureAdvance });
    setImage(null);
    props.close();
  };

  const formik = useFormik<FactureAdvanceCalderon>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: FactureAdvanceCalderon) => {
      const file = image ?? props.initialData?.file;
      const treasuryFile = treasuryImage ?? props.initialData?.treasuryFile;
      if (formData.centerCostCalderon.name === "") {
        toast.warning("El centro de costos no puede estar vacio");
        return;
      }
      if (formData.providerCalderon.emailCalderon === undefined) {
        toast.warning("El email del proveedor no puede estar vacio");
        return;
      }
      if (formData.beneficiary === "") {
        toast.warning("El beneficiario no puede estar vacio");
        return;
      }
      const factureNumber =
        formData.factureNumber.toString() === "" ? 0 : formData.factureNumber;
      handleClose();
      if (file !== null && treasuryFile != null) {
        await props.onDone({ ...formData, factureNumber, file, treasuryFile });
      } else if (file !== null) {
        await props.onDone({ ...formData, factureNumber, file });
      } else if (treasuryFile !== null) {
        await props.onDone({ ...formData, factureNumber, treasuryFile });
      } else {
        await props.onDone({ ...formData, factureNumber });
      }
      handleClose();
    },
  });

  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
  }, [props.initialData]);

  useEffect(() => {
    formik.setFieldValue(
      "valueNet",
      formik.values.value -
        formik.values?.valueRetention -
        formik.values?.discount +
        formik.values?.increase ?? 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values?.value,
    formik.values?.valueRetention,
    formik.values?.discount,
    formik.values?.increase,
  ]);

  useEffect(() => {
    formik.setFieldValue(
      "difference",
      formik.values?.valueNet - formik.values?.accreditedPayment ?? 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values?.valueNet, formik.values?.accreditedPayment]);

  useEffect(() => {
    loadClients();
    loadProviders();
    loadCenters();
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
        <div className="bg-white p-6 rounded shadow-lg z-10 w-2/3 h-5/6 overflow-y-auto">
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{ color: "#94a3b8" }}
              className="text-center text-xl mb-2 font-semibold"
            >
              CREAR NUEVO ITEM
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Centro de Costos
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder=" Digite un Centos de Costos"
                      value={formik.values?.centerCostCalderon.name}
                      onChange={(e) =>
                        onChangeHandlerCC(
                          e.target.value,
                          "centerCostCalderon.name",
                          centers
                        )
                      }
                    />
                    {suggestionsCC &&
                      suggestionsCC.map((suggestionC, e) => (
                        <div
                          key={e}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            OnSuggestHandlerCC(
                              suggestionC.name,
                              "centerCostCalderon.name"
                            )
                          }
                        >
                          {suggestionC.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Proveedor
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Ingrese el nombre del proveedor"
                      value={formik.values?.providerCalderon.name}
                      onChange={(e) =>
                        onChangeHandlerP(
                          e.target.value,
                          "providerCalderon.name",
                          providers
                        )
                      }
                    />
                    {suggestionsP &&
                      suggestionsP.map((suggestion, i) => (
                        <div
                          key={i}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            OnSuggestHandlerP(
                              suggestion.name,
                              "providerCalderon.name"
                            );
                            formik.setFieldValue(
                              "providerCalderon.emailCalderon",
                              suggestion.emailCalderon
                            );
                          }}
                        >
                          {suggestion.name} - {suggestion.emailCalderon}
                        </div>
                      ))}
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Email del proveedor
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Ingrese el email del proveedor"
                      name="providerCalderon.emailCalderon"
                      value={formik.values?.providerCalderon.emailCalderon}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                    * Detalle del Anticipo
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Detalle del Anticipo"
                      name="details"
                      value={formik.values?.details ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Valor
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Valor de Factura"
                      name="value"
                      value={formik.values?.value ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                      Observación
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Escriba una observacion"
                      name="observation"
                      value={formik.values?.observation ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1, 4]) && (
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Beneficiario
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Digite un Beneficiario"
                      disabled={CheckPermissions(auth, [4])}
                      value={formik.values?.beneficiary}
                      onChange={(e) =>
                        onChangeHandler(
                          e.target.value,
                          "beneficiary",
                          clients,
                          false
                        )
                      }
                    />
                    {suggestions &&
                      suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            OnSuggestHandler(
                              suggestion.beneficiary,
                              "beneficiary"
                            );
                            formik.setFieldValue("bank", suggestion.bank);
                            formik.setFieldValue(
                              "accountBank",
                              suggestion.accountBank
                            );
                            formik.setFieldValue(
                              "accountType",
                              suggestion.accountType
                            );
                            formik.setFieldValue(
                              "identificationCard",
                              suggestion.identificationCard
                            );
                            formik.setFieldValue("codBank", suggestion.codBank);
                            formik.setFieldValue(
                              "typeCard",
                              suggestion.typeCard
                            );
                          }}
                        >
                          {suggestion.beneficiary}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Cedula O RUC del Beneficiario
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="C.I. O RUC"
                      name="identificationCard"
                      value={formik.values?.identificationCard ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Banco del Beneficiario
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="# de Cuenta Bancaria"
                      name="bank"
                      value={formik.values?.bank ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Número de Cuenta Bancaria
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="# de Cuenta Bancaria"
                      name="accountBank"
                      value={formik.values?.accountBank ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Tipo de Cuenta Bancaria
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Tipo de cuenta"
                      name="accountType"
                      value={formik.values?.accountType ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 1]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Código del Banco
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Codigo del banco"
                      name="codBank"
                      value={formik.values?.codBank ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Tipo de identificación
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Cedula o RUC"
                      name="typeCard"
                      value={formik.values?.typeCard ?? ""}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Elegir Prov o Nomina
                    </label>
                    <select className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="typeProv"
                      value={formik.values?.typeProv}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione Prov o Nomina</option>
                      <option value="NOMINA">NOMINA</option>
                      <option value="PROV">PROV</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Tipo de Pago
                    </label>
                    <select className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="typePayments"
                      value={formik.values?.typePayments}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione un tipo de pago</option>
                      <option value="CHEQUE">CHEQUE</option>
                      <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Número del Cheque
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Digite el numero del cheque"
                      name="numberCheck"
                      value={formik.values?.numberCheck ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Banco del Cheque
                    </label>
                    <select className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="bankCheck"
                      value={formik.values?.bankCheck}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione el banco del Cheque</option>
                      <option value="PICHINCHA">PICHINCHA</option>
                      <option value="BGR">BGR</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Descuento
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      name="discount"
                      value={formik.values?.discount ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Incremento
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      name="increase"
                      value={formik.values?.increase ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3]) && (
                  <>
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                      Observación
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      name="observationTreasury"
                      placeholder="Escriba aquí una observación..."
                      value={formik.values?.observationTreasury ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 4]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Estado del Pago
                    </label>
                    <select className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="payments"
                      value={formik.values?.payments}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione una opción</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 6]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Pago Acreditado
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      name="accreditedPayment"
                      value={formik.values?.accreditedPayment ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 6]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Diferencia
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder=""
                      name="difference"
                      value={formik.values?.difference ?? 0}
                      // onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 6]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Nota de Débito
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      name="debitNote"
                      placeholder="Escriba la nota de débito"
                      value={formik.values?.debitNote ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 6]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Adjuntar Comprobante de Pago
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="file"
                      placeholder="Seleccione un archivo"
                      name="treasuryFile"
                      onChange={(event: any) => {
                        setTreasuryImage(event.target.files[0]);
                      }}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Tipo de Documento
                    </label>
                    <select className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="documentDelivered"
                      value={formik.values?.documentDelivered}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione un Documento</option>
                      <option value="Factura Electronica">
                        Factura Electrónica
                      </option>
                      <option value="Copia">Copia</option>
                      <option value="Factura Original">Factura Original</option>
                      <option value="Liquidacion de compra">
                        Liquidación de compra
                      </option>
                      <option value="N/A">N/A</option>
                      <option value="S/S">S/S</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Fecha de Factura
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="date"
                      placeholder="Fecha de Factura"
                      name="factureDate"
                      value={formik.values?.factureDate ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Número de Factura
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Numero de Factura"
                      name="factureNumber"
                      value={formik.values?.factureNumber ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Número de Retención
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Numero de retencion"
                      name="numberRetention"
                      value={formik.values?.numberRetention ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Valor de Retención
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Valor de Retencion"
                      name="valueRetention"
                      value={formik.values?.valueRetention ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 3, 4, 6, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Valor a Pagar
                    </label>
                    <input className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Valor Pagado"
                      name="valueNet"
                      value={formik.values?.valueNet ?? 0}
                      // onChange={formik.handleChange}
                      disabled
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                     * Asiento de Cierre
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      name="closingSeat"
                      value={formik.values?.closingSeat}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Adjuntar imagen de la Factura
                    </label>
                    <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="file"
                      placeholder="Seleccione un archivo"
                      name="treasuryFile"
                      onChange={(event: any) => {
                        setTreasuryImage(event.target.files[0]);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <hr />
            <div className="justify-end mt-3 grid md:grid-cols-4 grid-cols-1 gap-4">
              <div className="md:col-end-4">
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
                  type="submit"
                >
                  Guardar Anticipo
                </button>
              </div>
              <div>
                <button
                  className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FactureAdvanceCalderonModal;
