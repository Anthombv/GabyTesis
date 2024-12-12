
import { useAuth } from "../../lib/hooks/use_auth";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import { UserRole } from "../../model";

type Props = {
  permissions: Array<UserRole>;
  children: React.ReactNode;
};

const RoleLayout = (props: Props) => {
  const { auth } = useAuth();
  if (CheckPermissions(auth, props.permissions)) return <>{props.children}</>;
  return <div>No tiene permiso para entrar a esta Página</div>;
};

export default RoleLayout;
