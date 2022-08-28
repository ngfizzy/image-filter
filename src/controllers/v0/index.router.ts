import { Router } from 'express';
import { FilteredImage } from './filteredimage/routes/filteredimage.router';

const router: Router = Router();

router.use('/', FilteredImage);

export const FilteredImageIndexRouter: Router = router