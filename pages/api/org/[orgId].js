import db from '/mongo/db';
import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';
import { getItem } from '../../../mongo/controllers/itemOld';
import { getOrg } from '../../../mongo/controllers/orgControllers';

import Organization from '/mongo/schemas/OrganizationSchema';

import axios from 'axios';

export default async function handler(req, res) {
  const { orgId } = req.query;

  let status = axios.HttpStatusCode.BadRequest;
  let message = 'Invalid Method';
  let org = {};

  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      org = getOrg(orgId);
    } else {
      status = axios.HttpStatusCode.Unauthorized;
      message = 'Permission denied';
    }
  } else if (req.method === 'PATCH') {
    const session = await getSession({ req });

    if (session) {
      org = await Organization.findById(orgId);

      if (org) {
        if (org.leader._id.toString() === session.user.id) {
          if (req.body.title) {
            const { title } = req.body;
            org.title = title;
          } else if (req.body.addMember) {
            org.members.push(req.body.addMember);
          }

          try {
            await org.save();
            org = await getOrg(orgId);
          } catch (e) {
            status = 500;
            message = `Updating Item failed: ${e}`;
          }

          if (org) {
            status = axios.HttpStatusCode.Ok;
            message = 'Org updated';
          }
        } else {
          status = axios.HttpStatusCode.Unauthorized;
          message = 'Permission denied';
        }
      } else {
        status = axios.HttpStatusCode.NoContent;
        message = 'Org does not exisist';
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized;
      message = 'Permission denied';
    }
  }
  res.status(status).json({
    message,
    org,
  });
}
