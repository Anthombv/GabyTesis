/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../hooks/use_auth";
import { CheckPermissions } from "../utils/check_permissions";
import { FiSettings } from "react-icons/fi";
import ProvidersModal from "./modals/providersModal";
import CenterCostModal from "./modals/centerCost";
import ProyectsModal from "./modals/projects";
import UserModalH from "./modals/userM";
import GeneralReportModal from "./modals/generalReport";
import Router from "next/router";

const CustomNavbar = () => {
  const { logout, auth } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleCC, setModalVisibleCC] = useState<boolean>(false);
  const [modalVisibleP, setModalVisibleP] = useState<boolean>(false);
  const [modalVisibleU, setModalVisibleU] = useState<boolean>(false);
  const [modalVisibleGR, setModalVisibleGR] = useState<boolean>(false);

  const showModal = () => setModalVisible(true);
  const showModalCC = () => setModalVisibleCC(true);
  const showModalP = () => setModalVisibleP(true);
  const showModalU = () => setModalVisibleU(true);
  const showModalGR = () => setModalVisibleGR(true);

  const handleLogout = useCallback(() => {
    logout();
    Router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, Router]);

  return (
    <>
      <Navbar
        style={{
          width: "100%",
          minHeight: "3.4em",
          fontSize: "16px",
        }}
        bg="light"
        expand="lg"
      >
        <Container>
          <Navbar.Brand>Grupo ANCON{` - ${auth?.userName}`}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                className="text-danger"
                href={
                  auth?.role === 1 || auth?.role === 8
                    ? "/requestsSolicitude"
                    : "/solicitude"
                }
              >
                Solicitudes
              </Nav.Link>
              <Nav.Link
                className="text-danger"
                href={
                  auth?.role === 1 || auth?.role === 8
                    ? "/requestsAdvance"
                    : "/advance"
                }
              >
                Anticipos
              </Nav.Link>
              {CheckPermissions(auth, [0, 3, 4, 5, 9]) && (
                <>
                  <Nav.Link className="text-danger" href="/nomina">
                    Nomina
                  </Nav.Link>
                </>
              )}
              {CheckPermissions(auth, [0, 1, 3, 8]) && (
                <>
                  <Nav.Link className="text-danger" href="/beneficiary">
                    Beneficiarios
                  </Nav.Link>
                </>
              )}
              <>
                <Dropdown>
                  <Dropdown.Toggle
                    className="border-0"
                    variant="outline-danger"
                  >
                    Reportes
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {CheckPermissions(auth, [0, 5]) && (
                      <>
                        <Dropdown.Item onClick={showModalGR}>
                          Reporte Gerencial
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Item onClick={showModal}>
                      Proveedores
                    </Dropdown.Item>
                    <Dropdown.Item onClick={showModalCC}>
                      Centro de Costos
                    </Dropdown.Item>
                    <Dropdown.Item onClick={showModalP}>Proyecto</Dropdown.Item>
                    <Dropdown.Item onClick={showModalU}>Usuario</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
              {CheckPermissions(auth, [0]) && (
                <>
                  <Nav.Link className="text-danger" href="/auditory">
                    Auditoría
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav style={{ marginRight: "1em" }}>
              {CheckPermissions(auth, [0]) && (
                <>
                  <Nav.Link
                    className="text-danger bg-red "
                    href="/configuration"
                  >
                    <FiSettings />
                  </Nav.Link>
                </>
              )}
              <Button variant="outline-dark" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ProvidersModal
        visible={modalVisible}
        close={() => {
          setModalVisible(null);
        }}
      />

      <CenterCostModal
        visible={modalVisibleCC}
        close={() => {
          setModalVisibleCC(null);
        }}
      />

      <ProyectsModal
        visible={modalVisibleP}
        close={() => {
          setModalVisibleP(null);
        }}
      />

      <UserModalH
        visible={modalVisibleU}
        close={() => {
          setModalVisibleU(null);
        }}
      />

      <GeneralReportModal
        visible={modalVisibleGR}
        close={() => {
          setModalVisibleGR(null);
        }}
      />
    </>
  );
};

export default CustomNavbar;
