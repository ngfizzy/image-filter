import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { isUri } from 'valid-url';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  const validateImageUrlParam: express.RequestHandler = (req, res, next)  => {
      const imageUrl: string = req.query.image_url;

      if(!imageUrl) {
        return res.status(400).json({ error: 'image_url query param is required' })
      }

      if(!isUri(imageUrl)) {
        return res.status(400).json(
         { error: 'image_url must be a valid image url'}
        )
      }

      return next()
  }

  app.get('/v0/filteredimage', validateImageUrlParam, async (req: Request, res: Response) => {
    const imageUrl: string  = req.query.image_url

    try {
      const filteredImage: string = await filterImageFromURL(imageUrl)

      res.sendFile(filteredImage)
      deleteLocalFiles([ filteredImage ])
    } catch(err) {
      const error = err as Error
   
      if(error.message && error.message.includes('Could not find MIME for Buffer')) {
        // in production, we would use a proper logger like winston

        console.log("Could not get file mime type", error)
    
        return res.status(422).json({
          error: 'Could not read image mime type, Please try another image.'
        })
      }
  
      console.log('Error processing image', error)
  
      return res.status(500).json({
        error: "Sorry :( . We couldn't process your request"
      })

    }
  })


  app.get('/filteredimage', (req: Request, res: Response) => {
    return  res.redirect(`v0/filteredimage?image_url=${req.query.image_url}`)
  })

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();