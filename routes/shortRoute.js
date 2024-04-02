const { Router } = require("express")
const { createShort, allUserCreatedShort, getShortById, updateShort, deleteShort, searchByName,  downloadQRCode } = require("../controllers/shortController")
const authenticate = require("../middlewares/tokenValidation")
const router = Router()

router.use(authenticate)

/**
 * @swagger
 * components:
 *      schemas:
 *          Short:
 *              type: object
 *              required:
 *                  - name
 *                  - originalURL
 *                  - userId
 *              properties:
 *                  id:
 *                     type: integer
 *                     description: Auto-generated by the db
 *                  name:
 *                      type: string
 *                      description: The name of the short URL
 *                  originalURL:
 *                      type: string
 *                      description: The original link to be shortened
 *                  description:
 *                      type: string
 *                      description: This describes the original link.
 *                  clickedTimes:
 *                      type: integer
 *                      description: Calculates the total time the shortened link was clicked
 *                  shortened:
 *                      type: string
 *                      description: The new generated link
 *                  userId:
 *                      type: integer
 *                      description: The user that generated the link
 *          
 *   
 *          newShort: 
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The name of the short URL
 *                  originalURL:
 *                      type: string
 *                      description: The original link to be shortened
 *                  customizedLink:
 *                      type: string
 *                      description: Input your preferred link to customize
 *                  description:
 *                      type: string
 *                      description: This describes the original link.
 *   
 *          updateShort: 
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The name of the short URL
 *                  originalURL:
 *                      type: string
 *                      description: The original link to be shortened
 *                  description:
 *                      type: string
 *                      description: This describes the original link               
 */


/**
 * @swagger
 * tags:
 *   name: Shorts
 *   description: The short URL managing API
 */


/**
 * @swagger
 * /api/v1/short/search:
 *   get:
 *     summary: Search for a short URL by name
 *     description: Search for a short URL by name
 *     tags: [Shorts]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the short URL to search for
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The response object of the name searched
 *                 count:
 *                   type: integer
 *                   description: The count of the short URLs found
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Short URLs not found
 *       '500':
 *         description: Internal server error
 */
router.get("/search", searchByName)

/**
 * @swagger
 * /api/v1/short:
 *   get:
 *     summary: Get all short URLs
 *     description: Get all short URLs created by the user
 *     tags: [Shorts]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shorts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Short'
 *       '404':
 *         description: No short URLs found
 *       '500':
 *         description: Internal server error
 */
router.get("/", allUserCreatedShort)


/**
 * @swagger
 * /api/v1/short:
 *   post:
 *     summary: Create a short URL
 *     description: Create a new short URL
 *     tags: [Shorts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/newShort"
 *     responses:
 *       '201':
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Short'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/",createShort)


/**
 * @swagger
 * /api/v1/short/{id}/download:
 *   get:
 *     summary: Generates a QR code from the shortened URL for download.
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the short URL to generate QR code for.
 *     responses:
 *       '200':
 *         description: Image of the QR code
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id/download", downloadQRCode)

/**
 * @swagger
 * /api/v1/short/{id}:
 *   get:
 *     summary: Get a short URL by ID
 *     description: Get a short URL by its ID
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the short URL to get
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Short'
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id", getShortById)


/**
 * @swagger
 * /api/v1/short/{id}:
 *   patch:
 *     summary: Update a short URL by ID
 *     description: Update a short URL by its ID
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the short URL to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateShort'
 *     responses:
 *       '200':
 *         description: Short URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Short'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id",updateShort)

/**
 * @swagger
 * /api/v1/short/{id}:
 *   patch:
 *     summary: Update a short URL by ID
 *     description: Update a short URL by its ID
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the short URL to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateShort'
 *     responses:
 *       '200':
 *         description: Short URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Short'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/:id",updateShort)


/**
 * @swagger
 * /api/v1/short/{id}:
 *   delete:
 *     summary: Delete a short URL by ID
 *     description: Delete a short URL by its ID
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the short URL to delete
 *     responses:
 *       '200':
 *         description: Short URL deleted successfully
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id",deleteShort)






module.exports = router