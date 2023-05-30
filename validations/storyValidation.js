const { body, validationResult , checkSchema} = require('express-validator');

const storyDataValidationChainMethod = [
    body("title")
        .exists({ checkFalsy: true })
        .withMessage("Title is required"),
    body("body")
        .exists()
        .withMessage("Body is required")
        .isLength({ min: 5 })
        .withMessage("Body should be at least 5 characters"),
    body("status")
        .isIn(["public", "private", "unpublished"])
];

const storySchema = checkSchema({
    title: {
        exists: {
            errorMessage: "Title is required",
        }
    },
    body: {
        exists: {
            errorMessage: "Body is required",
        },
        isLength: {
            options: { min: 5 },
            errorMessage: "Body should be at least 5 characters",
        },
    }
});

// const validateRequest = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         throw new RequestValidationError(errors.array());
//     }
//     next();
// };

module.exports = {
    storySchema,
    storyDataValidationChainMethod
}