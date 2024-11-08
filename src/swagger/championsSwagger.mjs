/**
 * @swagger
 * /api/champions:
 *   get:
 *     summary: Get all champions
 *     tags: [Champions]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Language code (default is en_US)
 *     responses:
 *       200:
 *         description: List of champions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                 champions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       key:
 *                         type: string
 *                       name:
 *                         type: string
 *                       difficulty:
 *                         type: integer
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/champions/{id}:
 *   get:
 *     summary: Get champion details by ID
 *     tags: [Champions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Champion details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     key:
 *                       type: string
 *                     name:
 *                       type: string
 *                     title:
 *                       type: string
 *                     skins:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           num:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           chromas:
 *                             type: boolean
 *                     lore:
 *                       type: string
 *                     blurb:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     partype:
 *                       type: string
 *                     difficulty:
 *                       type: integer
 *                     spells:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                     passive:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *       500:
 *         description: Server error
 */
