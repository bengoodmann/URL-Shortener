const { Router } = require("express")
const { registerUser, loginUser } = require("../controllers/userController")
const router = Router()


/**
 * @swagger
 * components:
 *      schemas:
 *        User:
 *          type: object
 *          required:
 *               - name
 *               - email
 *               - password
 *          properties:
 *               name:
 *                  type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a user
 *     description: Register a new user with name, email, and password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/User"
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 User created:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Email is already registered
 *       '500':
 *         description: Internal server error
 */
router.post("/register", registerUser)


/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/User"
 *
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/login", loginUser)


module.exports = router