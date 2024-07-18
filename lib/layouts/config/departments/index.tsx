import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { UserDeparment } from "../../../types";
import HttpClient from "../../../utils/http_client";

const DeparmentsPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<UserDeparment>>([]);

  const loadData = async () => {
    setLoading(true)
    const response = await HttpClient("/api/department", 'GET', auth.userName, auth.role);
    const deparments: Array<UserDeparment> = response.data ?? [];
    setTableData(deparments)
    setLoading(false)
  }

  const updateRow = async (data: any) => {
    const response = await HttpClient("/api/department", 'PUT', auth.userName, auth.role, data);
    if(response.success) toast.success('Departamento Actualizado')
    else  toast.success('Error!')
    await loadData();
  }

  const removeRow = async (data: any) => {
    const response = await HttpClient("/api/department/" + data.id, 'DELETE', auth.userName, auth.role);
    if(response.success) toast.success('Departamento Eliminado')
    else  toast.success('Error!')
    await loadData();
  }

  const insertRow = async (data: any) => {
    const response = await HttpClient("/api/department", 'POST', auth.userName, auth.role, data);
    if(response.success) toast.success('Nuevo Departamento Insertado')
    else  toast.success('Error!')
    await loadData();
  }

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del departamento",
    },
  ];

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '40px 0' }}>
    <LoadingContainer visible={loading} miniVersion>
      <TreeTable
        dataSource={tableData}
        columns={columns}
        defaultActions={{
          updating: true,
          deleting: true,
          adding: true
        }}
        onRow={{
          updated: updateRow,
          removed: removeRow,
          inserted: insertRow,
        }}
        searchPanel={true}
        colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
      />
    </LoadingContainer>
        </div>
  )
}

export default DeparmentsPanel