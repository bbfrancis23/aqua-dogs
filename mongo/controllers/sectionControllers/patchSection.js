import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import mongoose from 'mongoose';

import Item from 'mongo/schemas/ItemSchema';
import Section from '/mongo/schemas/SectionSchema';

import SectionType from '/mongo/schemas/SectionTypeSchema';
import Tag from '/mongo/schemas/TagSchema';

export const patchSection = async (req, res) => {
  const { sectionId } = req.query;
  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let item = undefined;
  let section = undefined;

  await db.connect();

  try {
    section = await Section.findById(sectionId).populate({
      path: 'sectiontype',
      model: SectionType,
    });
  } catch (e) {
    status = axios.HttpStatusCode.InternalServerError;
    message = e;
  }

  if (section) {
    try {
      item = await Item.findById(section.itemid);
    } catch (e) {
      status = axios.HttpStatusCode.InternalServerError;
      message = e;
    }

    if (item) {
      if (item.scope === 'public') {
        const session = await getSession({ req });
        const isSiteAdmin = session?.user.roles.includes('SiteAdmin');
        if (isSiteAdmin) {
          const { sectiontype, content } = req.body;

          if (sectiontype) {
            section.sectiontype = sectiontype;
          }
          if (content) {
            section.content = content;
          }

          try {
            await section.save();
            item = await Item.findById(section.itemid).populate({
              path: 'sections',
              model: Section,
            });
          } catch (e) {
            status = axios.HttpStatusCode.InternalServerError;
            message = e;
          }
        } else {
          status = axios.HttpStatusCode.Forbidden;
        }
      } else {
        // todo
      }
    } else {
      status = axios.HttpStatusCode.NotFound;
    }
  }

  await db.disconnect();
  res.status(status).json({
    message,
    item: item ? item.toObject({ getters: true }) : undefined,
  });
};
