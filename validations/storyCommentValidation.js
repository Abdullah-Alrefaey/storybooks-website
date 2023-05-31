const { body, validationResult , checkSchema} = require('express-validator');

const storyCommentValidation = [
    body("commentBody")
    .exists({ checkFalsy: true })
    .withMessage("comment is required"),
];

const storyCommentSchema = checkSchema({
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
    storyCommentSchema,
    storyCommentValidation
}