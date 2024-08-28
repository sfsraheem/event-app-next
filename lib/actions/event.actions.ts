"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  UpdateEventParams,
} from "@/types";
import { connectToDatabase } from "../database";
import UserModel from "../database/models/user.model";
import { getPaginationDetails, handleError } from "../utils";
import EventModel from "../database/models/event.model";
import CategoryModel from "../database/models/category.model";
import { revalidatePath } from "next/cache";

const populateEvents = async (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: UserModel,
      select: "firstName lastName",
    })
    .populate({
      path: "category",
      model: CategoryModel,
      select: "name",
    });
};

const getCategoryByName = async (name: string) => {
  return CategoryModel.findOne({ name: { $regex: name, $options: "i" } });
};

export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDatabase();

    const organizer = await UserModel.findById(userId);

    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const newEvent = await EventModel.create({
      ...event,
      category: event.categoryId,
      organizer: organizer._id,
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await EventModel.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase();

    const event = await populateEvents(EventModel.findById(eventId));

    if (!event) {
      throw new Error("Event not found");
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const condition = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };
    const totalCount = await EventModel.countDocuments(condition);

    const { offset, totalPages } = getPaginationDetails(
      totalCount,
      limit,
      page
    );

    const eventQuery = EventModel.find(condition)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const events = await populateEvents(eventQuery);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages,
    };
  } catch (error) {
    handleError(error);
  }
};

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    const event = await EventModel.findById(eventId);

    if (event) {
      revalidatePath(path);
    }

    await EventModel.findByIdAndDelete(eventId);
  } catch (error) {
    handleError(error);
  }
};
