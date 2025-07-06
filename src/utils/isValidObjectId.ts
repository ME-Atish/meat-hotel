import mongoose from "mongoose";

/**
 * Validation for object id
 *
 * @param ObjectId id
 *
 * @return void
 */
const isValidObjectid = (id: mongoose.Types.ObjectId) => {
   mongoose.Types.ObjectId.isValid(id);
};

export default isValidObjectid;
