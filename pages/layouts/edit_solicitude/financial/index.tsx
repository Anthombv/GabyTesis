import { Col, Row, Form } from "react-bootstrap";
import { Facture, FormikComponentProps, Solicitude } from "../../../../model";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/hooks/use_auth";
import { CheckFinished } from "../../../../lib/utils/check_permissions";
import { Aprobado, Procesando, Pendiente } from "../../../../lib/utils/constants";

type Props = {
  formik: any;
  items: Array<Facture>;
  setItems: React.Dispatch<React.SetStateAction<Facture[]>>;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const FinancialPanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;

  return (
    <Row className={inTabs ? "justify-content-center" : ""}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Label
          className={inTabs ? "ml-5 mt-3" : ""}
          style={{ color: "black" }}
        >
          Estado de Financiero
        </Form.Label>
        <Form.Select
          name="financialState"
          value={formik.values?.financialState}
          onChange={formik.handleChange}
          disabled={CheckFinished(
            auth,
            [4],
            formik.values?.soliciterState,
            Aprobado
          )}
        >
          <option>Seleccione una opción</option>
          <option value={Procesando}>Procesando</option>
          <option value={Pendiente}>Pendiente</option>
          <option value={Aprobado}>Aprobado</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FinancialPanel;
