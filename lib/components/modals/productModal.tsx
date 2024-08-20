import { useEffect, useState } from "react";
import { ModalProps, Product } from "../../types";
import { useAuth } from "../../hooks/use_auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";

const initialProduct: Product = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  category: "",
};

interface Props extends ModalProps<Product> {
  initialData?: Product;
}

const ProductModal = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Product>(initialProduct);

  const handleClose = () => {
    formik.resetForm({ values: initialProduct });
    props.close();
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Product) => {
      if (formData.name === "") {
        toast.warning("El nombre del producto no puede estar vacio");
        return;
      }
      if (formData.price === 0) {
        toast.warning("El precio del producto no puede ser 0");
        return;
      }
      if (formData.stock === 0) {
        toast.warning("El stock del producto no puede estar en 0");
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
            <h2
              style={{
                color: "#334155",
                fontStyle: "normal",
                fontSize: "24px",
                fontFamily: "Lato",
                fontWeight: "bold",
              }}
            >
              Producto
            </h2>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3 my-6">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Nombre del producto
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese el nombre del producto"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>
							<div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Precio del producto
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder=""
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                />
              </div>
							<div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Stock del producto
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder=""
                  name="stock"
                  onChange={formik.handleChange}
                  value={formik.values.stock}
                />
              </div>
							<div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Descripción del producto
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese la descripción del producto"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </div>
							<div>
                <label className="text-gray-700 text-sm font-bold mb-2">
                  * Categoría del producto
                </label>

                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Ingrese la categoría del producto"
                  name="category"
                  onChange={formik.handleChange}
                  value={formik.values.category}
                />
              </div>
            </div>

            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent mb-4 rounded-full text-sm"
              type="submit"
            >
              Guardar Producto
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

export default ProductModal;
