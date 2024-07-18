import uploadFile from "../firebase/uploadFile";
import { CloudImage, Facture } from "../types";

const checkFile = (file: File | CloudImage): boolean => {
  return (file as CloudImage)?.secure_url !== undefined ? true : false
}

export const UploadSolicitudeImages = async (
    factures: Array<Facture>
  ): Promise<Array<Facture>> => {
    for (let i = 0; i < factures.length; i++) {
      if(factures[i].file !== undefined) {
        if (!checkFile(factures[i].file)) {
          const data = await uploadFile(factures[i].file as File)
          factures[i].file = {
            secure_url: data,
          };
        }
      }
      if(factures[i].treasuryFile !== undefined){
        if (!checkFile(factures[i].treasuryFile)) {
          const data = await uploadFile(factures[i].treasuryFile as File)
          factures[i].treasuryFile = {
            secure_url: data,
          };
        }
      }
    }
    return factures;
  };