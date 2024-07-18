import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import {
  FactureAdvanceRecaudaciones,
  FactureProviderRecaudaciones,
  ModalProps,
  ResponseData,
} from "../../types";
import { CheckPermissions } from "../../utils/check_permissions";
import HttpClient from "../../utils/http_client";

const initialFactureAdvance: FactureAdvanceRecaudaciones = {
  id: null,
  //Solicitante
  project: {
    name: "RECAUDACIONES",
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

interface Props extends ModalProps<FactureAdvanceRecaudaciones> {
  initialData?: FactureAdvanceRecaudaciones;
}

const FactureAdvanceRecaudacionesModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] =
    useState<FactureAdvanceRecaudaciones>(initialFactureAdvance);
  const [image, setImage] = useState<File>(null);
  const [treasuryImage, setTreasuryImage] = useState<File>(null);
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
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
      "/api/providerRecaudaciones/",
      "GET",
      auth.userName,
      auth.role
    );
    setProviders(response.data ?? []);
  };

  const handleClose = () => {
    formik.resetForm({ values: initialFactureAdvance });
    setImage(null);
    props.close();
  };

  const formik = useFormik<FactureAdvanceRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: FactureAdvanceRecaudaciones) => {
      const file = image ?? props.initialData?.file;
      const treasuryFile = treasuryImage ?? props.initialData?.treasuryFile;
      if (formData.providerRecaudaciones.name === undefined) {
        toast.warning("El Proveedor no puede estar vacio");
        return;
      }
      if (formData.beneficiary === "") {
        toast.warning("El beneficiario no puede estar vacio");
        return;
      }
      handleClose();
      if (file !== null && treasuryFile != null) {
        await props.onDone({ ...formData, file, treasuryFile });
      } else if (file !== null) {
        await props.onDone({ ...formData, file });
      } else if (treasuryFile !== null) {
        await props.onDone({ ...formData, treasuryFile });
      } else {
        await props.onDone(formData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal show={props.visible} onHide={handleClose} size={"lg"}>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: theme.colors.red }}>
              Crear Nuevo Items
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Proveedor</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre del proveedor"
                        value={formik.values?.providerRecaudaciones.name}
                        onChange={(e) =>
                          onChangeHandlerP(
                            e.target.value,
                            "providerRecaudaciones.name",
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
                                "providerRecaudaciones.name"
                              );
                              formik.setFieldValue(
                                "providerRecaudaciones.emailRecaudaciones",
                                suggestion.emailRecaudaciones
                              );
                            }}
                          >
                            {suggestion.name} - {suggestion.emailRecaudaciones}
                          </div>
                        ))}
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Email del proveedor
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el email del proveedor"
                        name="provider.emailRecaudaciones"
                        value={
                          formik.values?.providerRecaudaciones
                            .emailRecaudaciones
                        }
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Fecha de Factura
                      </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Fecha de Factura"
                        name="factureDate"
                        value={formik.values?.factureDate ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 1, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Numero de Factura
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder="Numero de Factura"
                        name="factureNumber"
                        value={formik.values?.factureNumber ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Detalles</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Detalle de Factura"
                        name="details"
                        value={formik.values?.details ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 1, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Valor</Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder="Valor de Factura"
                        name="value"
                        value={formik.values?.value ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              {CheckPermissions(auth, [0, 1]) && (
                <>
                  <Form.Label className="ml-5 mt-3">Observacion</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escriba una observacion"
                    name="observation"
                    value={formik.values?.observation ?? ""}
                    onChange={formik.handleChange}
                  />
                </>
              )}
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 3, 4, 1]) && (
                    <div>
                      <Form.Label className="ml-5 mt-3">
                        Beneficiario
                      </Form.Label>
                      <Form.Control
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
                              formik.setFieldValue(
                                "codBank",
                                suggestion.codBank
                              );
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
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Cedula O RUC del Beneficiario
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="C.I. O RUC"
                        name="identificationCard"
                        value={formik.values?.identificationCard ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 3, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Banco del Beneficiario
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="# de Cuenta Bancaria"
                        name="bank"
                        value={formik.values?.bank ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Numero de Cuenta Bancaria
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="# de Cuenta Bancaria"
                        name="accountBank"
                        value={formik.values?.accountBank ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 3, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Tipo de Cuenta Bancaria
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Tipo de cuenta"
                        name="accountType"
                        value={formik.values?.accountType ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3, 1]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Código del Banco
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Codigo del banco"
                        name="codBank"
                        value={formik.values?.codBank ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 1, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Tipo de identificación
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Cedula o RUC"
                        name="typeCard"
                        value={formik.values?.typeCard ?? ""}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Elegir Prov o Nomina
                      </Form.Label>
                      <Form.Select
                        name="typeProv"
                        value={formik.values?.typeProv}
                        onChange={formik.handleChange}
                      >
                        <option>Seleccione Prov o Nomina</option>
                        <option value="NOMINA">NOMINA</option>
                        <option value="PROV">PROV</option>
                      </Form.Select>
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 1, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Tipo de Pago
                      </Form.Label>
                      <Form.Select
                        name="typePayments"
                        value={formik.values?.typePayments}
                        onChange={formik.handleChange}
                      >
                        <option>Seleccione un tipo de pago</option>
                        <option value="CHEQUE">CHEQUE</option>
                        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                      </Form.Select>
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Número del Cheque
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite el numero del cheque"
                        name="numberCheck"
                        value={formik.values?.numberCheck ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Banco del Cheque
                      </Form.Label>
                      <Form.Select
                        name="bankCheck"
                        value={formik.values?.bankCheck}
                        onChange={formik.handleChange}
                      >
                        <option>Seleccione el banco del Cheque</option>
                        <option value="PICHINCHA">PICHINCHA</option>
                        <option value="BGR">BGR</option>
                      </Form.Select>
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Descuento</Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        name="discount"
                        value={formik.values?.discount ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 3]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Incremento</Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        name="increase"
                        value={formik.values?.increase ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col sm>
                  {CheckPermissions(auth, [0, 4]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Pago</Form.Label>
                      <Form.Select
                        name="payments"
                        value={formik.values?.payments}
                        onChange={formik.handleChange}
                      >
                        <option>Seleccione una opción</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Pendiente">Pendiente</option>
                      </Form.Select>
                    </>
                  )}
                </Col>
              </Row>
              {CheckPermissions(auth, [0, 3]) && (
                <>
                  <Form.Label className="ml-5 mt-3">Observacion</Form.Label>
                  <Form.Control
                    type="text"
                    name="observationTreasury"
                    placeholder="Escriba aquí una observación..."
                    value={formik.values?.observationTreasury ?? ""}
                    onChange={formik.handleChange}
                  />
                </>
              )}

              {CheckPermissions(auth, [0, 6]) && (
                <>
                  <Form.Label className="ml-5 mt-3">
                    Adjuntar imagen del Pago
                  </Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Seleccione un archivo"
                    name="treasuryFile"
                    onChange={(event: any) => {
                      setTreasuryImage(event.target.files[0]);
                    }}
                  />
                </>
              )}
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 6]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Pago Acreditado
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        name="accreditedPayment"
                        value={formik.values?.accreditedPayment ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 6]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Diferencia</Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder=""
                        name="difference"
                        value={formik.values?.difference ?? 0}
                        // onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 6]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Nota de Débito
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="debitNote"
                        placeholder="Escriba la nota de débito"
                        value={formik.values?.debitNote ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 6]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Nota de Débito
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="debitNote"
                        placeholder="Escriba la nota de débito"
                        value={formik.values?.debitNote ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">Documento</Form.Label>
                      <Form.Select
                        name="documentDelivered"
                        value={formik.values?.documentDelivered}
                        onChange={formik.handleChange}
                      >
                        <option>Seleccione un Documento</option>
                        <option value="Factura Electronica">
                          Factura Electrónica
                        </option>
                        <option value="Copia">Copia</option>
                        <option value="Factura Original">
                          Factura Original
                        </option>
                        <option value="Liquidacion de compra">
                          Liquidación de compra
                        </option>
                        <option value="N/A">N/A</option>
                        <option value="S/S">S/S</option>
                      </Form.Select>
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Fecha de Factura
                      </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Fecha de Factura"
                        name="factureDate"
                        value={formik.values?.factureDate ?? ""}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Numero de Factura
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder="Numero de Factura"
                        name="factureNumber"
                        value={formik.values?.factureNumber ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Numero de Retencion
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder="Numero de retencion"
                        name="numberRetention"
                        value={formik.values?.numberRetention ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Valor de Retencion
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="noscroll"
                        placeholder="Valor de Retencion"
                        name="valueRetention"
                        value={formik.values?.valueRetention ?? 0}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col>
                  {CheckPermissions(auth, [0, 3, 4, 6, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Valor a Pagar
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Valor Pagado"
                        name="valueNet"
                        className="noscroll"
                        value={formik.values?.valueNet ?? 0}
                        // onChange={formik.handleChange}
                        disabled
                      />
                    </>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  {CheckPermissions(auth, [0, 2]) && (
                    <>
                      <Form.Label className="ml-5 mt-3">
                        Asiento de Cierre
                      </Form.Label>
                      <Form.Control
                        placeholder="Asiento de cierre"
                        type="text"
                        name="closingSeat"
                        value={formik.values?.closingSeat}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </Col>
                <Col></Col>
              </Row>
              {CheckPermissions(auth, [0, 2]) && (
                <>
                  <Form.Label className="ml-5 mt-3">
                    Adjuntar imagen de la Factura
                  </Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Seleccione un archivo"
                    name="file"
                    onChange={(event: any) => {
                      setImage(event.target.files[0]);
                    }}
                  />
                </>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="outline-danger" type="submit">
              Guardar Factura
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default FactureAdvanceRecaudacionesModal;
