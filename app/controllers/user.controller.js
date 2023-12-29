
const db = require("../models");
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const { requests: Requests } = db;


exports.getRequests = (req, res) => {
    Requests.findAll({where:{status: 'Active'}})
        .then(data => { res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

exports.getOldRequests = (req, res) => {
    Requests.findAll({where:{status: 'Resolved'}})
        .then(data => { res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.updateRequests = (req, res) => {
   if (req.body.params){
       Requests.findOne({ where: {  id: req.body.params.id}})
           .then(item => {
               Requests.update({status: 'Resolved',
                               comment:req.body.params.comment},
                               {where:{id:req.body.params.id}})
                   .then(res.status(200).send({message: "комментарий успешно добавлен"}))
                   .catch(err => { res.status(500).send({message: err.message})})
           })
           .catch(err => {
               res.status(500).send({ message: err.message });
           });
   }
   else res.status(500).send({message: "Не сохранено, что-то не пошло не так"});
}

exports.newRequest = (req, res) => {
    Requests.create({
        username: req.body.username,
        email: req.body.email,
        status: 'Active',
        message: req.body.message,
        comment: '',
    })
        .then(user => { res.status(200).send({ message:  " Заявка успешно зарегистрирована!"  });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


