import { z } from 'zod'
import { Types } from "mongoose";

const objectIdValidation = (value: string) => {
  const isValid = Types.ObjectId.isValid(value);
  return (isValid ? value : { message: "invalid objectId" });
};

export const objectIdValidationSchema = {
  dbId: z.string().refine(objectIdValidation),
};


