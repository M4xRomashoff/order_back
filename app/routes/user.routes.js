const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/requests",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.getRequests)
  app.get("/oldRequests",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.getOldRequests)

  app.put("/requests",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.updateRequests);

  app.post("/requests",
      controller.newRequest
  );

};
