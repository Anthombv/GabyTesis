import mongoose, { mongo, Schema } from "mongoose";
import {
  Auditory,
  Backup,
  CloudImage,
  Comment,
  Beneficiary,
  Facture,
  FactureProvider,
  Solicitude,
  User,
  Bank,
  Product,
  Customer,
  Sale,
} from "../types";

const CloudImageSchema = new mongoose.Schema<CloudImage>(
  {
    // public_id: { type: String, },
    secure_url: { type: String },
  },
  { timestamps: true }
);

const ProviderSchema = new mongoose.Schema<FactureProvider>(
  {
    name: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

ProviderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderModel =
  mongoose.models.Providers || mongoose.model("Providers", ProviderSchema);

const BanksSchema = new mongoose.Schema<Bank>(
  {
    bank: { type: String },
    codBank: { type: String },
  },
  { timestamps: true }
);

BanksSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BanksSchema.set("toJSON", {
  virtuals: true,
});

export const BanksModel =
  mongoose.models.Banks || mongoose.model("Banks", BanksSchema);

const BeneficiarySchema = new mongoose.Schema<Beneficiary>(
  {
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    accountTypeB: { type: String },
    codBank: { type: String },
    typeCard: { type: String },
  },
  { timestamps: true }
);

BeneficiarySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BeneficiarySchema.set("toJSON", {
  virtuals: true,
});

export const BeneficiaryModel =
  mongoose.models.Beneficiaries ||
  mongoose.model("Beneficiaries", BeneficiarySchema);

const FactureSchema = new mongoose.Schema<Facture>(
  {
    //Solicitante
    provider: { type: ProviderSchema },
    email: { type: ProviderSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureSchema.set("toJSON", {
  virtuals: true,
});

//Comentarios
const CommentSchema = new mongoose.Schema<Comment>(
  {
    userComment: { type: String },
    dateComment: { type: String },
    messageComment: { type: String },
  },
  { timestamps: true }
);

CommentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CommentSchema.set("toJSON", {
  virtuals: true,
});

export const CommentModel =
  mongoose.models.Comments || mongoose.model("Comments", CommentSchema);

//Solicitudes
const SolicitudeSchema = new mongoose.Schema<Solicitude>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    financialDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeModel =
  mongoose.models.Solicitudes ||
  mongoose.model("Solicitudes", SolicitudeSchema);

//Productos
const ProductSchema = new mongoose.Schema<Product>(
  {
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    description: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProductSchema.set("toJSON", {
  virtuals: true,
});

export const ProductModel =
  mongoose.models.Products || mongoose.model("Products", ProductSchema);

//Clientes
const CustomerSchema = new mongoose.Schema<Customer>(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
CustomerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CustomerSchema.set("toJSON", {
  virtuals: true,
});

export const CustomerModel =
  mongoose.models.Customers || mongoose.model("Customers", CustomerSchema);


  //Ventas
const SaleSchema = new mongoose.Schema<Sale>(
  {
    product: { type: [ProductSchema] },
    quantity: { type: Number },
    totalPrice: { type: Number },
    saleDate: { type: String },
    customer: { type: CustomerSchema },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SaleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SaleSchema.virtual("total").get(function () {
  let total = 0;
  this.product.forEach((element: Product) => (total += element.price ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SaleSchema.set("toJSON", {
  virtuals: true,
});

export const SaleModel =
  mongoose.models.Sales ||
  mongoose.model("Sales", SaleSchema);

const BackupSchema = new mongoose.Schema<Backup>(
  {
    solicitude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudes",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupSchema.set("toJSON", {
  virtuals: true,
});

export const BackupModel =
  mongoose.models.Backups || mongoose.model("Backups", BackupSchema);

const UserSchema = new mongoose.Schema<User>(
  {
    userName: { type: String },
    password: { type: String },
    email: { type: String },
    department: { type: String },
    role: { type: Number },
    name: { type: String },
    identificationCard: { type: String },
    dateBirth: { type: String },
    age: { type: Number },
  },
  { timestamps: true }
);

// Duplicate the ID field.
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set("toJSON", {
  virtuals: true,
});

export const UserModel =
  mongoose.models.Users || mongoose.model("Users", UserSchema);

const AuditorySchema = new mongoose.Schema<Auditory>(
  {
    date: { type: String },
    user: { type: String },
    action: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AuditorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AuditorySchema.set("toJSON", {
  virtuals: true,
});

export const AuditoryModel =
  mongoose.models.Auditory || mongoose.model("Auditory", AuditorySchema);
