import mongoose from "mongoose";

/**
 * Validation for object id
 *
 * @param ObjectId id
 *
 * @return void
 */
const isValidObjectid = (id:string) => {
   const resultValidation = mongoose.Types.ObjectId.isValid(id);
   return resultValidation;
};

export default isValidObjectid;
