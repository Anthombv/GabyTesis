import { FormikProps, FormikErrors, FormikTouched } from "formik";

//tipos de datos para la app
export type AuthContextProps = {
  auth: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

export type ResponseData = {
  message?: string;
  data?: any;
  success: boolean;
};

export type LoginData = {
  userName: string;
  password: string;
};

export type UserRole =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6

export type User = {
  id?: string;
  userName: string;
  password?: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  identificationCard: string;
  dateBirth: string;
  age: number;
  dateAdmission: string;
  position: string;
  bussines: string;
  cellphone: string;
  yearsWorked: string;
  holidays: string;
  discount: string;
  count: string;
  countPermission: number;
};

export type CloudImage = {
  secure_url: string;
};

export type FactureCenter = {
  id?: string;
  name: string;
  projectId: string;
};

export type FactureProvider = {
  id?: string;
  name: string;
  email: string;
};

export type FactureEmployees = {
  id?: string;
  beneficiary: string;
  bank: string;
  position: string;
  department: string;
  identificationCard: string;
  accountBank: string;
  accountType: string;
  typeCard: string;
  codBank: string;
  typeProv: string;
  value: string;
};

export type Bank = {
  id?: string;
  bank: string;
  codBank: string;
};

export type Client = {
  id?: string;
  beneficiary: string;
  identificationCard: string;
  bank: string;
  accountBank: string;
  accountType: string;
  codBank: string;
  typeCard: string;
  accountTypeB: string;
};

export interface Facture {
  id?: string;
  //Solicitante
  project: FactureProject;
  centerCost: FactureCenter;
  provider: FactureProvider;
  email: FactureProvider;
  factureDate: string;
  factureNumber: number;
  details: string;
  value: number;
  file?: File | CloudImage;
  observation: string;
  //contabilidad
  numberRetention: number;
  valueRetention: number;
  valueNet: number;
  documentDelivered: string;
  observationConta: string;
  closingSeat: string;
  //tesoreria
  beneficiary: string;
  identificationCard: string;
  bank: string;
  accountBank: string;
  accountType: string;
  typeCard: string;
  accountTypeB: string;
  codBank: string;
  typeProv: string;
  numberCheck: string;
  bankCheck: string;
  discount: number;
  increase: number;
  observationTreasury: string;
  //Financiero
  payments: string;
  typePayments: string;
  //tesoreria 2
  difference: number;
  treasuryFile?: File | CloudImage;
  accreditedPayment: number;
  debitNote: string;
}

export type Comment = {
  id?: string;
  userComment: string;
  dateComment: string;
  messageComment: string;
};

export interface Solicitude {
  id?: string;
  number: number;
  soliciter: string;
  date: string;
  details: string;
  soliciterState: string;
  contableState: string;
  advanceState: string;
  contableAdvanceState: string;
  imageTreasuryState: string;
  paymentTreasuryState: string;
  financialState: string;
  items: Array<Facture>;
  financialDate: string;
  contableAdvanceDate: string;
  advanceDate: string;
  treasuryDate: string;
  accountantDate: string;
  applicantDate: string;
  imageTreasuryDate: string;
  itemsComment: Array<Comment>;
}

export type Nomina = {
  id?: string;
  number: number;
  soliciter: string;
  soliciterState: string;
  date: string;
  details: string;
  month: string;
  items: Array<FactureEmployees>;
  state: string;
};

export type Holidays = {
  id?: string;
  number: number;
  soliciter: string;
  deparmentSoliciter: string;
  soliciterId?: string;
  typePermissions: string;
  details: string;
  state: string;
  dateState: string;
  date: string;
  dateS: string;
  dateE: string;
  requestedDays: number;
  requestedHour: string;
  startTime: string;
  finalTime: string;
  observation: string;
};

export interface Permission extends Holidays {}
export interface Loan extends Holidays {}

//backups
export type Backup = {
  id?: string;
  solicitude: any | Solicitude;
  nomina: any | Nomina;
  holidays: any | Holidays;
  permission: any | Permission;
  loan: any | Loan;
};

export type Auditory = {
  id?: string;
  date: string;
  user: string;
  action: string;
};

export interface ModalProps<T> {
  visible: boolean;
  close: () => void;
  onDone?: (data?: T) => void | Promise<void>;
}

export interface FormikComponentProps<T = Element> extends FormikProps<T> {
  formik: {
    values: T;
    handleChange: {
      (e: ChangeEvent<any>): void;
      <T_1 = string | ChangeEvent<T>>(field: T_1): T_1 extends ChangeEvent<T>
        ? void
        : (e: string | ChangeEvent<T>) => void;
    };
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
    setFieldValue: (
      field: string,
      value: T,
      shouldValidate?: boolean
    ) => Promise<void> | Promise<FormikErrors<T>>;
    setFieldError: (field: string, value: string) => void;
  };
}
