import { Row, Form, Col } from "react-bootstrap";
import { FormikComponentProps, Solicitude } from "../../../../model";
import { useAuth } from "../../../../lib/hooks/use_auth";
import { CheckFinished } from "../../../../lib/utils/check_permissions";
import { Aprobado, Elaborando } from "../../../../lib/utils/constants";
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
