"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import CategoryModel from "../database/models/category.model";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDatabase();

    const newCategory = await CategoryModel.create({
      name: categoryName,
    });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await CategoryModel.find({});

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
