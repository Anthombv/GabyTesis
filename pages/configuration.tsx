import React from "react";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import ProvidersPanel from "../lib/layouts/config/provider";
import UsersPanel from "../lib/layouts/config/users";
import RoleLayout from "../lib/layouts/role_layout";
import Banks from "../lib/layouts/config/banks";
import Sidebar from "../lib/components/sidebar";

const Configuration = () => {
  const tabPanels: Array<TabPanel> = [
    {
      name: "Usuarios",
      content: <UsersPanel />,
    },

    {
      name: "Proveedores",
      content: <ProvidersPanel />,
    },
    {
      name: "Bancos",
      content: <Banks />,
    },
  ];

  return (
    <RoleLayout permissions={[0]}>
      <title>Configuracion del sistema</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <TabContainer
                tabPanels={tabPanels}
                style={{ padding: "40px 0" }}
              />
            </div>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default Configuration;
