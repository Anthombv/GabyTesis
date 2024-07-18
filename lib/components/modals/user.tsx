import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { User, ModalProps } from "../../types";

const initialUser: User = {
  id: null,
  userName: "",
  password: "",
  email: "",
  department: "",
  role: 1,
  name: "",
  identificationCard: "",
  dateBirth: "",
  age: 0,
  dateAdmission: "",
  position: "",
  bussines: "",
  cellphone: "",
  yearsWorked: "",
  holidays: "",
  discount: "",
  count: "",
  countPermission: 0,
};

interface Props extends ModalProps<User> {
  initialData?: User;
}

const UserModal = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<User>(initialUser);

  const handleClose = () => {
    formik.resetForm({ values: initialUser });
    props.close();
  };

  // maneja los datos y comportamiento del formulario
  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: User) => {
      setLoading(true);
      await props.onDone(formData);
      setLoading(false);
      handleClose();
    },
  });

  //Calcula la edad de una persona
  useEffect(() => {
    let fechaActual: Date = new Date();
    let fechaNacimiento: Date = new Date(formik.values?.dateBirth);
    let anios: number =
      fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    fechaNacimiento.setFullYear(fechaNacimiento.getFullYear());

    if (fechaActual < fechaNacimiento) {
      --anios;
    }
    formik.setFieldValue("age", anios);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values?.dateBirth, formik.values.age]);

  useEffect(() => {
    let fechaIngreso = new Date(formik.values?.dateAdmission);
    let fechaActual = new Date();
    let vacaciones = 0;
    let anios: number = fechaActual.getFullYear() - fechaIngreso.getFullYear();
    fechaIngreso.setFullYear(fechaIngreso.getFullYear());

    if (fechaActual < fechaIngreso) {
      --anios;
    }
    if (anios <= 5) {
      vacaciones =
        15 - parseInt(formik.values.discount) + parseInt(formik.values.count);
    } else if (anios === 6) {
      vacaciones =
        15 +
        1 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 7) {
      vacaciones =
        15 +
        2 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 8) {
      vacaciones =
        15 +
        3 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 9) {
      vacaciones =
        15 +
        4 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 10) {
      vacaciones =
        15 +
        5 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 11) {
      vacaciones =
        15 +
        6 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 12) {
      vacaciones =
        15 +
        7 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 13) {
      vacaciones =
        15 +
        8 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 14) {
      vacaciones =
        15 +
        9 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 15) {
      vacaciones =
        15 +
        10 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 16) {
      vacaciones =
        15 +
        11 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 17) {
      vacaciones =
        15 +
        12 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 18) {
      vacaciones =
        15 +
        13 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios === 19) {
      vacaciones =
        15 +
        14 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    } else if (anios >= 20) {
      vacaciones =
        15 +
        15 -
        parseInt(formik.values.discount) +
        parseInt(formik.values.count);
    }

    formik.setFieldValue("yearsWorked", anios);
    formik.setFieldValue("holidays", vacaciones);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.dateAdmission,
    formik.values.yearsWorked,
    formik.values.holidays,
    formik.values.discount,
    formik.values.count,
  ]);

  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
  }, [props.initialData]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 w-2/3 h-5/6 overflow-y-auto">
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{ color: theme.colors.red }}
              className="text-center text-xl mb-2 font-semibold"
            >
              Crear Nuevo Usuario
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Nombre del Trabajador
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Nombre de Usuario"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Cedula o RUC
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Cedula o Ruc"
                  name="identificationCard"
                  onChange={formik.handleChange}
                  value={formik.values.identificationCard}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Fecha de nacimiento
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  id="dateBirth"
                  name="dateBirth"
                  value={formik.values?.dateBirth}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Edad
                </label>

                <input
                  className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="number"
                  name="age"
                  onChange={formik.handleChange}
                  value={formik.values.age}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Nombre de Usaurio
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Nombre de Usuario"
                  name="userName"
                  onChange={formik.handleChange}
                  value={formik.values.userName}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Contraseña
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  E-mail
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="email"
                  placeholder="Correo electrónico"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Telefono Celular
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese el numero del trabajador"
                  name="cellphone"
                  onChange={formik.handleChange}
                  value={formik.values.cellphone}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Empresa
                </label>

                <select
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="bussines"
                  onChange={formik.handleChange}
                  value={formik.values?.bussines ?? ""}
                >
                  <option>Seleccione una empresa</option>
                  <option value="IC">IC</option>
                  <option value="IG">IG</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Departamento
                </label>

                <select
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  aria-label="Default select department"
                  name="department"
                  onChange={formik.handleChange}
                  value={formik.values?.department ?? ""}
                >
                  <option>Seleccione un Departamento</option>
                  <option value="CONTABILIDAD">CONTABILIDAD</option>
                  <option value="ASISTENCIA GERENCIA">
                    ASISTENCIA GERENCIA
                  </option>
                  <option value="GERENCIA">GERENCIA</option>
                  <option value="GESTION Y CREDITO">GESTION Y CREDITO</option>
                  <option value="MARKETING">MARKETING</option>
                  <option value="MENSAJERIA">MENSAJERIA</option>
                  <option value="PRODUCCION">PRODUCCIÓN</option>
                  <option value="RECEPCION">RECEPCIÓN</option>
                  <option value="SERVICIOS GENERALES">
                    SERVICIOS GENERALES
                  </option>
                  <option value="SISTEMAS">SISTEMAS</option>
                  <option value="SOCIOS">SOCIOS</option>
                  <option value="VENTAS">VENTAS</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Cargo que Ocupa
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Cargo que ocupa"
                  name="position"
                  onChange={formik.handleChange}
                  value={formik.values.position}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Fecha de Ingreso
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  name="dateAdmission"
                  onChange={formik.handleChange}
                  value={formik.values.dateAdmission}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Años trabajando
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  name="yearsWorked"
                  onChange={formik.handleChange}
                  value={formik.values.yearsWorked ?? ""}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Dias de Vacaciones
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  name="holidays"
                  onChange={formik.handleChange}
                  value={formik.values.holidays}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Dias descontados
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  name="discount"
                  onChange={formik.handleChange}
                  value={formik.values.discount}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Dias aumentados
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  name="count"
                  onChange={formik.handleChange}
                  value={formik.values.count}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Tipo de Rol
                </label>

                <select
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  aria-label="Default select role"
                  name="role"
                  onChange={formik.handleChange}
                  value={formik.values.role}
                  defaultValue={1}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                  <option value={11}>11</option>
                  <option value={12}>12</option>
                  <option value={13}>13</option>
                  <option value={14}>14</option>
                  <option value={15}>15</option>
                  <option value={16}>16</option>
                  <option value={17}>17</option>
                  <option value={18}>18</option>
                  <option value={19}>19</option>
                  <option value={20}>20</option>
                  <option value={21}>21</option>
                  <option value={22}>22</option>
                  <option value={23}>23</option>
                  <option value={24}>24</option>
                  <option value={25}>25</option>
                  <option value={26}>26</option>
                  <option value={27}>27</option>
                  <option value={28}>28</option>
                  <option value={29}>29</option>
                  <option value={30}>30</option>
                  <option value={31}>31</option>
                  <option value={32}>32</option>
                  <option value={33}>33</option>
                  <option value={34}>34</option>
                  <option value={35}>35</option>
                  <option value={36}>36</option>
                  <option value={37}>37</option>
                </select>
              </div>
            </div>
            <hr />
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-4"
              type="submit"
            >
              Guardar
            </button>
          </form>
          <button
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};
export default UserModal;
