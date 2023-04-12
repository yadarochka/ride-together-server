const Router = require("express");
const router = new Router();

router.get("/", async (req,res) => { 
    res.status(200).send("Сервер в порядке")
});

module.exports = router;
