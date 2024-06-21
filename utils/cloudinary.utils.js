import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "duzmyzmpa",
  api_key: "667322765163825",
  api_secret: "3vbirFk2VL-InUpDy7BMdpPdRdk",
});
const UploadOnCloudinary = (localpath) => {
  try {
    if (localpath) {
      const res = cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return res;
    } else {
      fs.unlinkSync(localpath);
      return null;
    }
  } catch (error) {
    return null;
  }
};
export default UploadOnCloudinary;
