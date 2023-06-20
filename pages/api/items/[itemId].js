import db from '/mongo/db';
import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import { getMember, flattenMember } from '/mongo/controllers/memberControllers';

import mongoose from 'mongoose';
import { getItem } from '../../../mongo/controllers/itemOld';
import { patchItem } from 'mongo/controllers/itemControllers/patchItem';

import { deleteItem } from 'mongo/controllers/itemControllers/deleteItem';

/* eslint-disable */

export default async function handler(req, res) {
  const { itemId } = req.query;
  if (req.method === 'PATCH') {
    await patchItem(req, res);
    return;
  } else if (req.method === 'DELETE') {
    await deleteItem(req, res);
    return;
  } else if (req.method === 'GET') {
    const result = await getItem(itemId);

    res.status(result.status).json({
      message: result.message,
      item: result.item,
    });
  }
}
