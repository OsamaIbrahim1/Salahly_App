import multer from "multer";
import { allowedExtensions } from "../utils";
import UniqueString from "../utils/generate-Unique-String";

export const multerImages = {

    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.images.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}

export const multerVideos = {
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.video.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}

export const multerAudio = {

    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.audio.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}

export const multerDocument = {

    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.document.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}

export const multerCompressed = {

    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.compressed.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}

export const multerCode = {

    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFilename = UniqueString.generateUniqueString(5) + "_" + file.originalname;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: (req: Request, file: any, cb: any) => {
        if (allowedExtensions.code.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}