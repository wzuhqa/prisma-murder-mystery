const passService = require('../services/pass.service');

// @desc    Get Pass details for the logged-in user
// @route   GET /api/pass/my-pass
// @access  Private
exports.getMyPass = async (req, res, next) => {
    try {
        const pass = await passService.getPassForUser(req.user.id);

        res.status(200).json({
            success: true,
            data: pass
        });
    } catch (err) {
        next(err);
    }
};
