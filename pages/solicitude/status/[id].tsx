import { useEffect, useState } from "react";
import Router from "next/router";
import { useAuth } from "../../../lib/hooks/use_auth";
import { ModalProps, ResponseData, Solicitude } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import { useFormik } from "formik";
import theme from "../../../lib/styles/theme";

interface Props extends ModalProps<Solicitude> {
  initialData?: Solicitude;
}

const StatusSolicitude = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Solicitude>(null);

  const loadData = async () => {
    const solicitudeId = Router.query.id as string;
    const response: ResponseData = await HttpClient(
      "/api/solicitude/" + solicitudeId,
      "GET",
      auth.userName,
      auth.role
    );
    setInitialValues(response.data ?? []);
  };

  const handleClose = () => {
    props.close();
  };

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Solicitude) => {},
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values?.soliciterState === "Elaborando") {
      formik.values.applicantDate = "";
    } else {
      formik.values?.applicantDate;
    }

   

 

    if (formik.values?.financialState === "Pendiente") {
      formik.values.financialDate = "";
    } else {
      formik.values?.financialDate;
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values?.applicantDate,
    formik.values?.soliciterState,
    formik.values?.financialState,
    formik.values?.financialDate,
  ]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-2/5 w-5/6 h-3/6 overflow-y-auto">
          {/* <div
            style={{ color: theme.colors.red }}
            className="text-center text-xl mb-2 font-semibold"
          >
            Estado de solicitud
          </div> */}
          <div className="my-4 text-center">
                <em
                  style={{
                    color: "#334155",
                    fontStyle: "normal",
                    fontSize: "18px",
                    fontFamily: "Lato",
                    fontWeight: "bold",
                  }}
                >
                  SOLICITUD {" "}
                </em>                
                <em
                  style={{
                    color: "#94a3b8",
                    fontStyle: "normal",
                    fontSize: "18px",
                    fontFamily: "Lato",
                  }}
                >
                   INMOCONSTRUCCIONES
                </em> 
              </div>
              <label className="text-gray-700 font-semibold mx-4">
                Orden de Pago #{" "}
                <em
                  style={{
                    color: "#bb22dd",
                    fontStyle: "normal",
                    fontSize: "18px",
                    fontFamily: "Arial Black",
                  }}
                >
                  {formik.values?.number ?? 0}
                </em>                
              </label>
              <label className="text-slate-400 text-end text-sm">Creada el: {formik.values?.date}</label> 
          <hr />
          <div className="grid grid-cols-2 my-4 mx-8">
            <strong>Solicitante: </strong>
            <em
                  style={{
                    color: "#0f172a",
                    fontStyle: "normal",
                    fontSize: "14px",
                   
                  }}
                >Estado - <strong>{formik.values?.soliciterState}</strong> - {formik.values?.applicantDate}
                </em>
           
            
            <strong>Financiera: </strong>
            <em
                  style={{
                    color: "#0f172a",
                    fontStyle: "normal",
                    fontSize: "14px",
                   
                  }}
                >Estado - <strong>{formik.values?.financialState}</strong> - {formik.values?.financialDate}
                </em>

          </div>
          <hr />
          <div className="relative items-end justify-end mt-4">
            <button
              className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default StatusSolicitude;
