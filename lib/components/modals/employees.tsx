import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { Employees, ModalProps, ResponseData } from "../../types";
import HttpClient from "../../utils/http_client";
import LoadingContainer from "../loading_container";

const initialClient: Employees = {
  beneficiary: "",
  position: "",
  department: "",
  identificationCard: "",
  bank: "",
  accountBank: "",
  accountType: "",
  codBank: "",
  typeCard: "",
};

interface Props extends ModalProps<Employees> {
  initialData?: Employees;
}

const EmployeeModal = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Employees>(initialClient);
  const [banks, setBanks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const loadBanks = async () => {
    const response: ResponseData = await HttpClient(
      "/api/bank",
      "GET",
      auth.userName,
      auth.role
    );
    setBanks(response.data ?? []);
    console.log(response.data);
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

  const formik = useFormik<Employees>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Employees) => {
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
      if (formData.typeCard === "") {
        toast.warning("El tipo de identificacion no puede estar vacio");
        return;
      }
      setLoading(true);
      await props.onDone(formData);
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
      <Modal show={props.visible} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                color: theme.colors.red,
                width: "100%",
                textAlign: "center",
              }}
            >
              Crear nuevo Empleado
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoadingContainer visible={loading} miniVersion>
              <Form.Group>
                <Form.Label className="ml-5">Nombre de empleado</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre del beneficiario"
                  name="beneficiary"
                  onChange={formik.handleChange}
                  value={formik.values.beneficiary}
                />

                <Form.Label className="ml-5 mt-3">Cedula o RUC</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Ingrese cedula o RUC de beneficiario"
                  name="identificationCard"
                  onChange={formik.handleChange}
                  value={formik.values.identificationCard}
                />

                <Form.Label className="ml-5 mt-3">Departamento</Form.Label>

                <Form.Select
                  name="department"
                  value={formik.values?.department}
                  onChange={formik.handleChange}
                >
                  <option>Seleccione un Departamento</option>
                  <option value="COMERCIAL">COMERCIAL</option>
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                  <option value="PRODUCCION">PRODUCCION</option>
                </Form.Select>

                <Form.Label className="ml-5 mt-3">Cargo</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Escriba aqui el cargo del empleado..."
                  name="position"
                  value={formik.values?.position}
                  onChange={formik.handleChange}
                />

                <Form.Label className="ml-5 mt-3">Banco</Form.Label>

                <Form.Control
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

                <Form.Label className="ml-5 mt-3">Numero de cuenta</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Ingrese el numero de cuenta"
                  name="accountBank"
                  onChange={formik.handleChange}
                  value={formik.values.accountBank}
                />

                <Form.Label className="ml-5 mt-3">Tipo de Cuenta</Form.Label>

                <Form.Select
                  aria-label="Default select accountType"
                  name="accountType"
                  onChange={formik.handleChange}
                  value={formik.values.accountType}
                >
                  <option>Seleccion un tipo de cuenta</option>
                  <option value="AHO">AHO</option>
                  <option value="CC">CC</option>
                </Form.Select>

                <Form.Label className="ml-5 mt-3">Código del banco</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Ingrese el codigo del banco"
                  name="codBank"
                  onChange={formik.handleChange}
                  value={formik.values.codBank}
                />

                <Form.Label className="ml-5 mt-3">Tipo de documento</Form.Label>

                <Form.Select
                  aria-label="Default typeCard"
                  name="typeCard"
                  onChange={formik.handleChange}
                  value={formik.values.typeCard}
                >
                  <option>Seleccion un tipo de documento</option>
                  <option value="C">C</option>
                  <option value="R">R</option>
                </Form.Select>
              </Form.Group>
            </LoadingContainer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="outline-danger" type="submit">
              Guardar Beneficiario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeModal;
