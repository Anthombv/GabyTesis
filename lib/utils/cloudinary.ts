// import { v2 as cloudinary } from "cloudinary";
import { CloudImage, Facture, Solicitude } from "../types";

//TODO: eliminar imagen
const cloudName = "diyrzpo9t";
const apiKey = "853167564635246";

// const checkFile = (file: File | CloudImage): boolean => {
//   return (file as CloudImage).public_id !== undefined ? true : false
// }

// export const UploadSolicitudeImages = async (
//   factures: Array<Facture>
// ): Promise<Array<Facture>> => {
//   for (let i = 0; i < factures.length; i++) {
//     if(factures[i].file !== undefined) {
//       if (!checkFile(factures[i].file)) {
//         const formData = new FormData();
//         formData.append("file", factures[i].file as File);
//         formData.append("upload_preset", "facture");
//         const response = await fetch(
//           "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );
//         const data = await response.json();
//         factures[i].file = {
//           public_id: data.public_id,
//           secure_url: data.secure_url,
//         };
//       }
//     }
//   }
//   return factures;
// };

// export const DeleteFactureImage = async (
//   pictureIdToDelete: string
// ): Promise<boolean> => {

//   const timestamp = Math.round(new Date().getTime() / 1000);

//   const signature = cloudinary.utils.api_sign_request(
//     {
//       timestamp: timestamp,
//       source: "uw",
//       folder: "facture",
//     },
//     apiKey
//   );

//   const formData = new FormData();
//   formData.append("public_id", pictureIdToDelete);
//   formData.append("api_key", apiKey);
//   formData.append("signature", signature);
//   const response = await fetch(
//     "https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy",
//     {
//       method: "POST",
//       body: formData,
//     }
//   );
//   const data = await response.json();
//   console.log("data", data);
//   return true;
// };
