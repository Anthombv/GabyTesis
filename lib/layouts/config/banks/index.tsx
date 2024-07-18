import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { Bank } from "../../../types";
import HttpClient from "../../../utils/http_client";

const Banks = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Bank>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/bank",
      "GET",
      auth.userName,
      auth.role
    );
    const banks: Array<Bank> = response.data ?? [];
    setTableData(banks);
    setLoading(false);
  };

  const updateRow = async (data: any) => {
    const response = await HttpClient(
      "/api/bank",
      "PUT",
      auth.userName,
      auth.role,
      data
    );
    if (response.success) toast.success("Banco actualizado");
    else toast.success("Error!");
    await loadData();
  };

  const removeRow = async (data: any) => {
    const response = await HttpClient(
      "/api/bank/" + data.id,
      "DELETE",
      auth.userName,
      auth.role
    );
    if (response.success) toast.success("Banco Eliminado");
    else toast.success("Error!");
    await loadData();
  };

  const insertRow = async (data: any) => {
    const response = await HttpClient(
      "/api/bank",
      "POST",
      auth.userName,
      auth.role,
      data
    );
    if (response.success) toast.success("Nuevo banco creado");
    else toast.success("Error!");
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "bank",
      caption: "Nombre del Banco",
    },
    {
      dataField: "codBank",
      caption: "Codigo del banco",
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <LoadingContainer visible={loading}>
        <TreeTable
          dataSource={tableData}
          columns={columns}
          defaultActions={{
            updating: true,
            deleting: true,
            adding: true,
          }}
          onRow={{
            updated: updateRow,
            removed: removeRow,
            inserted: insertRow,
          }}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} bancos)`
          }
        />
      </LoadingContainer>
    </div>
  );
};
export default Banks;
