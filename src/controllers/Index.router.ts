import { Router, Request, Response } from 'express';
import { StatusCodes } from '../util/util';
import { FilteredImageIndexRouter } from './v0/index.router';

const router: Router = Router();

// filteredimage and v0/fiteredimage points to the same router since v0 is our latest
router.use('/filteredimage', FilteredImageIndexRouter);
router.use('v0/filteredimage', FilteredImageIndexRouter);

  // Root Endpoint
// Displays a simple message to the user
router.get('/', async (_: Request, res: Response) => {
    return res.send('try GET /filteredimage?image_url={{}}');
});

router.get('*', (_, res: Response) => {
    return res.status(StatusCodes.NotFound)
})

export const IndexRouter: Router = router;
