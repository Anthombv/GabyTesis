import { useState } from "react";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import ProvidersModal from "../lib/components/modals/providersModal";
import CenterCostModal from "../lib/components/modals/centerCost";
import ProyectsModal from "../lib/components/modals/projects";
import UserModalH from "../lib/components/modals/userM";
import RoleLayout from "../lib/layouts/role_layout";

const Reportes = () => {
  const { auth } = useAuth();
  const [modalVisibleProviders, setModalVisibleProviders] =
    useState<boolean>(false);
  const [modalVisibleCC, setModalVisibleCC] = useState<boolean>(false);
  const [modalVisibleP, setModalVisibleP] = useState<boolean>(false);
  const [modalVisibleU, setModalVisibleU] = useState<boolean>(false);

  const showModalProviers = () => setModalVisibleProviders(true);
  const showModalCC = () => setModalVisibleCC(true);
  const showModalP = () => setModalVisibleP(true);
  const showModalU = () => setModalVisibleU(true);

  return (
    <>
      <RoleLayout permissions={[0, 1, 2, 4, 5, 6]}>
        <title>Reportes</title>
        <div className="flex h-screen">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex justify-center">
            <div className="w-11/12 bg-white my-14">
              <h1 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                Reportes Generales
              </h1>
              
            </div>
          </div>
        </div>

        <ProvidersModal
          visible={modalVisibleProviders}
          close={() => {
            setModalVisibleProviders(null);
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
      </RoleLayout>
    </>
  );
};
export default Reportes;
