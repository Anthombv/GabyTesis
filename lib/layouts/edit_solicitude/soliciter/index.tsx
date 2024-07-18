import { Row, Form, Col } from "react-bootstrap";
import { useAuth } from "../../../hooks/use_auth";
import { FormikComponentProps, Solicitude } from "../../../types";
import { CheckFinished } from "../../../utils/check_permissions";
import { Elaborando, Aprobado } from "../../../utils/constants";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const SoliciterPanel = (props: Props) => {
  const { auth } = useAuth()
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  return (
    <Row className={inTabs ? "justify-content-center" : ""}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Label
          className={inTabs ? "ml-5 mt-3" : ""}
          style={{ color: "black" }}
        >
          Estado de Solicitante
        </Form.Label>
        <Form.Select
          name="soliciterState"
          value={formik.values?.soliciterState}
          onChange={formik.handleChange}
          disabled={CheckFinished(auth, [1], formik.values?.soliciterState, Aprobado)}
        >
          <option>Seleccione una opción</option>
          <option value={Elaborando}>Elaborando</option>
          <option value={Aprobado}>Aprobado</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default SoliciterPanel;
