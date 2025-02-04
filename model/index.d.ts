import { FormikProps, FormikErrors, FormikTouched } from "formik";

//tipos de datos para la app
export type AuthContextProps = {
  auth: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

//Datos de respuesta
export type ResponseData = {
  message?: string;
  data?: any;
  success: boolean;
};

//Datos del login
export type LoginData = {
  userName: string;
  password: string;
};

//Roles del sistema
export type UserRole =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6

//Datos de los usuarios
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
};

//Guarda la url de la imagen de la factura o nota de debito 
//almacenada en la factura de pago a proveedores
export type CloudImage = {
  secure_url: string;
};

//Bancos existentes
export type Bank = {
  id?: string;
  bank: string;
  codBank: string;
};

//Datos basicos del proveedor
export type FactureProvider = {
  id?: string;
  name: string;
  email: string;
};

//Beneficiarios para el pago de una factura
export type Beneficiary = {
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

//Factura de una solicitud de pago a proveedores
export interface Facture {
  id?: string;
  //Solicitante
  provider: FactureProvider;
  email: FactureProvider;
  factureDate: string;
  factureNumber: number;
  details: string;
  value: number;
  file?: File | CloudImage;
  observation: string;
  numberRetention: number;
  valueRetention: number;
  valueNet: number;
  documentDelivered: string;
  beneficiary: string;
  identificationCard: string;
  bank: string;
  accountBank: string;
  accountType: string;
  typeCard: string;
  codBank: string;
  typeProv: string;
  numberCheck: string; //Variable numero de cheque
  bankCheck: string; //Variable banco de cheque
  discount: number;
  increase: number;
  observationTreasury: string;
  //Financiero
  payments: string;
  typePayments: string; //Variable tipo de pago
  difference: number;
  treasuryFile?: File | CloudImage;
  accreditedPayment: number;
  debitNote: string;
}

//Comentarios de una solicitud de pago a proveedores
export type Comment = {
  id?: string;
  userComment: string;
  dateComment: string;
  messageComment: string;
};

//Solicitudes de pago a proveedores
export interface Solicitude {
  total?: number;
  id?: string;
  number: number;
  soliciter: string;
  date: string;
  details: string;
  soliciterState: string;
  financialState: string;
  items: Array<Facture>;
  financialDate: string;
  applicantDate: string;
  itemsComment: Array<Comment>;
}

// Definición del tipo para un producto en el inventario
export type Product = {
  id?: string;         // Identificador único del producto
  name: string;       // Nombre del producto
  price: number;      // Precio del producto
  stock: number;      // Cantidad en inventario
  description?: string; // Descripción opcional del producto
  category: string;   // Categoría del producto
};

// Definición del tipo para un cliente
export type Customer = {
  id?: string;         // Identificador único del cliente
  name: string;       // Nombre del cliente
  email: string;      // Correo electrónico del cliente
  phone: string;      // Teléfono del cliente
  address: string;    // Dirección del cliente
};

// Definición del tipo para una venta
export type Sale = {
  id?: string;         // Identificador único de la venta
  product: Array<Product>;  // Identificador del producto vendido
  quantity: number;   // Cantidad de producto vendido
  totalPrice: number; // Precio total de la venta
  saleDate: string;     // Fecha de la venta
  customer: Customer; // Datos del cliente comprador
};

//backups
export type Backup = {
  id?: string;
  solicitude: any | Solicitude;
};

//Auditoria del sistema
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
