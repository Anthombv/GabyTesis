import Sidebar from "../lib/components/sidebar";
import RoleLayout from "../lib/layouts/role_layout";

const Ventas = () => {
  return (
    <>
      <RoleLayout permissions={[0, 4, 5]}>
        <title>Ventas</title>
        <div className="flex h-screen">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default Ventas;
