const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function signup(req, res){
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Успешно зарегистрирован!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message:  "Успешно зарегистрирован!"  });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


async function getRefresh(user){
    return await RefreshToken.createToken(user); ;
}

async function signIn(req, res){
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Неверный пароль!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: config.jwtExpiration,
                              });


      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

          getRefresh(user).then(refreshToken =>{
              res.status(200).send({
                  id: user.id,
                  username: user.username,
                  email:user.email,
                  roles: authorities,
                  accessToken: token,
                  refreshToken: refreshToken,
              });
          }).catch(err => {
              res.status(500).send({ message: err.message });
          });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

async function refreshToken(req, res) {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Необходимо обновить токен" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });


        if (!refreshToken) {
            res.status(403).json({ message: "Такого токена нет в базе " });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Срок токена истек, необходимо авторизироваться",
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

function signOut(req, res){
    res.status(200).send({ message: 'выход' });
};


module.exports = {signup,signIn,refreshToken,signOut}
