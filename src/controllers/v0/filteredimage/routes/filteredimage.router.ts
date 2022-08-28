import { Router, Request, Response } from 'express';
import { deleteLocalFiles, filterImageFromURL, StatusCodes } from '../../../../util/util';
import { validateImageUrlParam } from '../../middleware/validate-image-url-param.middleware';

const router: Router = Router();

router.get('/', validateImageUrlParam, async (req: Request, res: Response) => {
  const imageUrl: string = req.query.image_url;

  try {
    const filteredImage: string = await filterImageFromURL(imageUrl);
    res.sendFile(filteredImage);
    res.addListener('finish', async () => {
      await deleteLocalFiles([filteredImage]);
    });
  } catch (err) {
    // Note: in production, we would use a proper logger like winston
    const error: Error = err as Error;

    if (
      error.message &&
      error.message.includes('Could not find MIME for Buffer')
    ) {
      console.log('Could not get file mime type', error);

      return res.status(StatusCodes.UnprocessableEntity).json({
        error: 'Could not read image mime type, Please try another image.',
      });
    }

    console.log('Error processing image', error);

    return res.status(StatusCodes.ServerError).json({
      error: "Sorry :( . We couldn't process your request",
    });
  }
});


export const FilteredImage: Router = router;
