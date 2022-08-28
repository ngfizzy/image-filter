import { RequestHandler } from 'express';
import { isUri } from 'valid-url';

import { StatusCodes } from '../../../util/util';

export const validateImageUrlParam: RequestHandler = (req, res, next) => {
  const imageUrl: string = req.query.image_url;

  if (!imageUrl) {
    return res.status(StatusCodes.BadRequest).json({ error: 'image_url query param is required' });
  }

  if (!isUri(imageUrl)) {
    return res
      .status(StatusCodes.BadRequest)
      .json({ error: 'image_url must be a valid image url' });
  }

  return next();
};
