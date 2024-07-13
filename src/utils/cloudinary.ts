// cloudinary connection
import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, v2 as cloudinary } from "cloudinary";
import * as env from '../config/app.environments'
import { UploadApiResponse } from "cloudinary";


@Injectable()
export class CloudinaryConnection {
  constructor() {
   
  }

}