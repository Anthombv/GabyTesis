import RoleLayout from "../lib/layouts/role_layout";
import { useEffect, useState } from "react";
import TreeTable, { ColumnData } from "../lib/components/tree_table";
import LoadingContainer from "../lib/components/loading_container";
import { useAuth } from "../lib/hooks/use_auth";
import HttpClient from "../lib/utils/http_client";
import { Auditory } from "../lib/types";
import Sidebar from "../lib/components/sidebar";

const Auditory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Auditory>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/auditory",
      "GET",
      auth.userName,
      auth.role
    );
    const auditories: Array<Auditory> = response.data ?? [];
    setTableData(auditories);
    setLoading(false);
  };

  const columns: ColumnData[] = [
    {
      dataField: "date",
      caption: "Fecha y Hora",
      alignment: "center",
    },
    {
      dataField: "user",
      caption: "Usuario",
      alignment: "center",
    },
    {
      dataField: "action",
      caption: "Acción realizada",
      alignment: "center",
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoleLayout permissions={[0]}>
      <title>Auditoría</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <LoadingContainer visible={loading} miniVersion>
                <TreeTable
                  keyExpr="id"
                  dataSource={tableData}
                  columns={columns}
                  searchPanel={true}
                  style={{ marginBottom: "40px" }}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                />
              </LoadingContainer>
            </div>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};

export default Auditory;
