import { useEffect, useState } from "react";
import { Customer, ModalProps } from "../../../model";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/hooks/use_auth";

const initialClient: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

interface Props extends ModalProps<Customer> {
  initialData?: Customer;
}

const ClientesModal = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Customer>(initialClient);

  const handleClose = () => {
    formik.resetForm({ values: initialClient });
    props.close();
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Customer) => {
      if (formData.name === "") {
        toast.warning("El nombre del cliente no puede estar vacio");
        return;
      }
      if (formData.email === "") {
        toast.warning("El correo electronico no puede estar vacio");
        return;
      }
      if (formData.phone === "") {
        toast.warning("El telefono no puede estar vacio");
        return;
      }
      if (formData.address === "") {
        toast.warning("La direccion no puede estar vacia");
        return;
      }

      setLoading(true);
      await props.onDone({ ...formData });
      setLoading(false);
      handleClose();
    },
  });

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
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-1/3 w-5/6 md:h-4/6 overflow-y-auto">
          <form onSubmit={formik.handleSubmit}>
            <p className="my-4    text-center">
              <em
                style={{
                  color: "#334155",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato",
                  fontWeight: "bold",
                }}
              >
                NUEVO{" "}
              </em>
              <em
                style={{
                  color: "#94a3b8",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato",
                }}
              >
                CLIENTE
              </em>
            </p>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3 my-6">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Nombre del cliente
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Apellido y Nombre"
                  name="name"
                  onChange={(e) =>
                    formik.setFieldValue("name", e.target.value.toUpperCase())
                  }
                  value={formik.values.name}
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Correo del cliente
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Correo electronico del cliente"
                  name="email"
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value)
                  }
                  value={formik.values.email}
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Telefono del cliente
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="number"
                  placeholder="Telefono del cliente"
                  name="phone"
                  onChange={(e) =>
                    formik.setFieldValue("phone", e.target.value.toUpperCase())
                  }
                  value={formik.values.phone}
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Direccion del cliente
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Direccion del cliente"
                  name="address"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "address",
                      e.target.value.toUpperCase()
                    )
                  }
                  value={formik.values.address}
                />
              </div>
            </div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent mb-4 rounded-full text-sm"
              type="submit"
            >
              Guardar cliente
            </button>
          </form>
          <button
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientesModal;
