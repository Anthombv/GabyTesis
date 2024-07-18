import mongoose, { mongo, Schema } from "mongoose";
import {
  Auditory,
  Backup,
  CloudImage,
  Comment,
  Client,
  Facture,
  FactureCenter,
  FactureProvider,
  Solicitude,
  User,
  Nomina,
  Bank,
  Holidays,
  Permission,
  Loan,
  FactureEmployees,
} from "../types";

const CloudImageSchema = new mongoose.Schema<CloudImage>(
  {
    // public_id: { type: String, },
    secure_url: { type: String },
  },
  { timestamps: true }
);

const CenterSchema = new mongoose.Schema<FactureCenter>(
  {
    name: { type: String },
    projectId: { type: String },
  },
  { timestamps: true }
);

CenterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CenterSchema.set("toJSON", {
  virtuals: true,
});

export const CenterModel =
  mongoose.models.Centers || mongoose.model("Centers", CenterSchema);

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

const ClientSchema = new mongoose.Schema<Client>(
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

ClientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ClientSchema.set("toJSON", {
  virtuals: true,
});

export const ClientModel =
  mongoose.models.Clients || mongoose.model("Clients", ClientSchema);

const FactureSchema = new mongoose.Schema<Facture>(
  {
    //Solicitante
    centerCost: { type: CenterSchema },
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
    closingSeat: { type: String },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    observationConta: { type: String },
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
    accountTypeB: { type: String },
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
    contableState: { type: String },
    contableAdvanceState: { type: String },
    imageTreasuryState: { type: String },
    advanceState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
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

const FactureEmployeesSchema = new mongoose.Schema<FactureEmployees>(
  {
    beneficiary: { type: String },
    identificationCard: { type: String },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    value: { type: String },
    position: { type: String },
    department: { type: String },
  },
  { timestamps: true }
);

FactureEmployeesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

FactureEmployeesSchema.set("toJSON", {
  virtuals: true,
});

const NominaSchema = new mongoose.Schema<Nomina>(
  {
    number: { type: Number },
    soliciter: { type: String },
    soliciterState: { type: String },
    date: { type: String },
    details: { type: String },
    items: { type: [FactureEmployeesSchema] },
    state: { type: String },
    month: { type: String },
  },
  { timestamps: true }
);

NominaSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

NominaSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureEmployees) => (total += parseFloat(element.value) ?? 0)
  );
  return total;
});

NominaSchema.set("toJSON", {
  virtuals: true,
});

export const NominaModel =
  mongoose.models.Nominas || mongoose.model("Nominas", NominaSchema);

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

const BackupNominaSchema = new mongoose.Schema<Backup>(
  {
    nomina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nominas",
    },
  },
  { timestamps: true }
);

BackupNominaSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BackupNominaSchema.set("toJSON", {
  virtuals: true,
});

export const BackupNominaModel =
  mongoose.models.BackupsNomina ||
  mongoose.model("BackupsNomina", BackupNominaSchema);

const HolidaysSchema = new mongoose.Schema<Holidays>(
  {
    number: { type: Number },
    soliciter: { type: String },
    deparmentSoliciter: { type: String },
    soliciterId: { type: String },
    typePermissions: { type: String },
    details: { type: String },
    state: { type: String },
    date: { type: String },
    dateE: { type: String },
    dateS: { type: String },
    dateState: { type: String },
    requestedDays: { type: Number },
    requestedHour: { type: String },
    startTime: { type: String },
    finalTime: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
HolidaysSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
HolidaysSchema.set("toJSON", {
  virtuals: true,
});

export const HolidaysModel =
  mongoose.models.Holidays || mongoose.model("Holidays", HolidaysSchema);

const PermissionSchema = new mongoose.Schema<Permission>(
  {
    number: { type: Number },
    soliciter: { type: String },
    deparmentSoliciter: { type: String },
    soliciterId: { type: String },
    typePermissions: { type: String },
    details: { type: String },
    state: { type: String },
    date: { type: String },
    dateE: { type: String },
    dateS: { type: String },
    dateState: { type: String },
    requestedDays: { type: Number },
    requestedHour: { type: String },
    startTime: { type: String },
    finalTime: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
PermissionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
PermissionSchema.set("toJSON", {
  virtuals: true,
});

export const PermissionModel =
  mongoose.models.Permissions ||
  mongoose.model("Permissions", PermissionSchema);

const LoanSchema = new mongoose.Schema<Loan>(
  {
    number: { type: Number },
    soliciter: { type: String },
    deparmentSoliciter: { type: String },
    soliciterId: { type: String },
    typePermissions: { type: String },
    details: { type: String },
    state: { type: String },
    date: { type: String },
    dateE: { type: String },
    dateS: { type: String },
    dateState: { type: String },
    requestedDays: { type: Number },
    requestedHour: { type: String },
    startTime: { type: String },
    finalTime: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

LoanSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

LoanSchema.set("toJSON", {
  virtuals: true,
});

export const LoanModel =
  mongoose.models.Loans || mongoose.model("Loans", LoanSchema);

const BackupHolidaysSchema = new mongoose.Schema<Backup>(
  {
    holidays: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "holidays",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupHolidaysSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupHolidaysSchema.set("toJSON", {
  virtuals: true,
});

export const BackupHolidaysModel =
  mongoose.models.BackupsHolidays ||
  mongoose.model("BackupsHolidays", BackupHolidaysSchema);

const BackupPermissionSchema = new mongoose.Schema<Backup>(
  {
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "permissions",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupPermissionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupPermissionSchema.set("toJSON", {
  virtuals: true,
});

export const BackupPermissionModel =
  mongoose.models.BackupsPermissions ||
  mongoose.model("BackupsPermissions", BackupPermissionSchema);

const BackupLoanSchema = new mongoose.Schema<Backup>(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "loans",
    },
  },
  { timestamps: true }
);

BackupLoanSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BackupLoanSchema.set("toJSON", {
  virtuals: true,
});

export const BackupLoanModel =
  mongoose.models.BackupLoans ||
  mongoose.model("BackupLoans", BackupLoanSchema);

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
    dateAdmission: { type: String },
    position: { type: String },
    cellphone: { type: String },
    holidays: { type: String },
    yearsWorked: { type: String },
    bussines: { type: String },
    discount: { type: String },
    count: { type: String },
    countPermission: { type: Number },
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
