/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const db = require("../../data/db-config");

async function bul() {
  let allUsers = await db("users");
  let usersList = allUsers.map((item) => {
    return {
      user_id: item.user_id,
      username: item.username
    }
  })
  return usersList;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  let filterList = await db("users").where(filtre);
  
  return filterList;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  let user = await db("users").where("user_id", user_id).first();
  return {
    user_id: user.user_id,
    username: user.username
  };

}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  let insertedUserId = await db("users").insert(user);
  let insertedUser = await idyeGoreBul(insertedUserId);
  return insertedUser;
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle
}
