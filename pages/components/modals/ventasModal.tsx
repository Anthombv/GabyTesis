import { useEffect, useState } from "react";
import { ModalProps, Product, ResponseData, Sale } from "../../../model";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/hooks/use_auth";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";

const initialVentas: Sale = {
  product: [
    {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
    },
  ],
  quantity: 0,
  totalPrice: 0,
  saleDate: FormatedDate(),
  customer: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
};

interface Props extends ModalProps<Sale> {
  initialData?: Sale;
}

const VentasModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Sale>(initialVentas);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const loadProducts = async () => {
    const response = await HttpClient(
      "/api/product",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const product: Array<Product> = response.data;
      setProducts(product);
    } else {
      toast.warning(response.message);
    }
  };

  const loadClients = async () => {
    const response: ResponseData = await HttpClient(
      "/api/client/",
      "GET",
      auth.userName,
      auth.role
    );
    setClients(response.data ?? []);
  };

  const OnSuggestHandler = (text: string, field: string) => {
    formik.setFieldValue(field, text);
    setSuggestions([]);
  };

  const onChangeHandler = (
    text: string,
    field: string,
    suggestions: Array<any>,
    name: boolean = true
  ) => {
    let matches = [];
    if (text.length > 0) {
      matches = suggestions.filter((element) => {
        const regex = new RegExp(`${text}`, "gi");
        return name
          ? element.name.match(regex)
          : element.beneficiary.match(regex);
      });
    }
    setSuggestions(matches);
    formik.setFieldValue(field, text);
  };

  const handleClose = () => {
    formik.resetForm({ values: initialVentas });

    props.close();
  };

  const formik = useFormik<Sale>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Sale) => {
      //TODO: verificar la actualizacion de imagen
      if (formData.customer.name === "") {
        toast.warning("El nombre del cliente no puede estar vacio");
        return;
      }
      await props.onDone({ ...formData });
      handleClose();
    },
  });

  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
  }, [props.initialData]);

  useEffect(() => {
    loadClients();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              style={{ color: "#94a3b8" }}
              className="text-center text-xl mb-2 font-semibold"
            >
              REGISTRAR NUEVA VENTA
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Cliente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  placeholder="Ingrese el nombre del cliente"
                  value={formik.values?.customer.name}
                  onChange={(e) =>
                    onChangeHandler(e.target.value, "customer.name", clients)
                  }
                />
                {suggestions &&
                  suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        OnSuggestHandler(suggestion.name, "customer.name");
                        formik.setFieldValue(
                          "customer.email",
                          suggestion.email
                        );

                        formik.setFieldValue(
                          "customer.phone",
                          suggestion.phone
                        );

                        formik.setFieldValue(
                          "customer.address",
                          suggestion.address
                        );
                      }}
                    >
                      {suggestion.name}
                    </div>
                  ))}
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Email del cliente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="email"
                  placeholder="Ingrese el email del cliente"
                  name="customer.email"
                  value={formik.values?.customer.email}
                  onChange={formik.handleChange}
                  disabled
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Telefono del cliente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese el Telefono del cliente"
                  name="customer.phone"
                  value={formik.values?.customer.phone}
                  onChange={formik.handleChange}
                  disabled
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Direccion del cliente
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese la direccion del cliente"
                  name="customer.address"
                  value={formik.values?.customer.address}
                  onChange={formik.handleChange}
                  disabled
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Fecha de la venta
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  value={formik.values?.saleDate}
                  disabled
                />
              </div>
            </div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent mb-4 rounded-full text-sm"
              type="submit"
            >
              Guardar Venta
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

export default VentasModal;
