// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!

const md = require("../auth/auth-middleware");
const router = require("express").Router();
const userModel = require("../users/users-model");

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */

  router.post("/register", md.sifreGecerlimi ,md.usernameBostami, async (req, res, next) => {
    try {
      let registeredUser = await userModel.ekle(req.body);
      res.status(201).json(registeredUser); 
    } catch (error) {
      next(error);
    }
  });


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */

  router.post("/login", md.usernameVarmi, async(req, res, next) => {
    try {
      req.session.user_id = req.user.user_id;
      res.status(200).json({message: `Hoşgeldin ${req.user.username}`});
    } catch (error) {
      next(error);
    }
  })



/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */


  router.get("/logout", async(req, res, next) => {
    try {
      if(req.session.user_id) {
        req.session.destroy((err) => {
          if(err) {
            next({message: "Hata oluştu"});
          } else {
            next({
              status: 200,
              message: "Çıkış yapildi"
            })
          }
        })
      } else {
        next({
          status: 200,
          message: "Oturum bulunamadı"
        })
      }
    } catch (error) {
      next(error);
    }
  })
 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;