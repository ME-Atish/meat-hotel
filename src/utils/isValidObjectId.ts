import mongoose from "mongoose";

/**
 * Validates for the MongoDB's ObjectId
 *
 * @param {string} id
 *
 * @return boolean
 */
const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

export default isValidObjectId;
