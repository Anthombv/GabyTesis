import React, { useState } from "react";
import Router from "next/router";
import { useAuth } from "../lib/hooks/use_auth";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import SolicitudeICHistoryPanel from "../lib/layouts/companyHistory/inmoconstrucciones";
import { CheckPermissions } from "../lib/utils/check_permissions";
import Sidebar from "../lib/components/sidebar";
import RoleLayout from "../lib/layouts/role_layout";

// Inicio de la app
const SolicitudeHistory = () => {
  const { auth } = useAuth();
  const [dates, setDates] = useState<Array<string>>([]);

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitudes",
      content: <SolicitudeICHistoryPanel dates={dates} />,
    },
  ];


  return (
    <>
      <RoleLayout permissions={[0, 1, 3, 5]}>
        <title>Historial de Solicitudes de pago a proveedores</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-11/12 bg-white my-14">
              <div className="grid grid-cols-1">
                <div className="grid md:grid-cols-4 items-center justify-center my-3 gap-3"> 
                  <div className="mx-auto">
                      <button
                      className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => Router.back()}
                      >
                      Volver
                      </button> 
                  </div>
                </div>
                

                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
                <div className="grid md:grid-cols-4 items-center justify-center my-3 gap-3"> 
                  <div className="mx-auto">
                      <button
                      className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => Router.back()}
                      >
                      Volver
                      </button> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default SolicitudeHistory;
