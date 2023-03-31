const User = require("../../models/user")
const bcrypt = require("bcryptjs")
const session = require("../../session/session")

const settings = async (req, res) => {
  const { username, originalPassword, newPassword } = req.body
  const email = session.email

  let existingUser
  try {
    existingUser = await User.findOne({ email: email }).exec()
  } catch (err) {
    console.log(err)
  }
  console.log(existingUser)

  if (originalPassword.length > 0) {
    const isPasswordSame = bcrypt.compareSync(originalPassword, existingUser.password)
    if (!isPasswordSame) {
      return {
        success: false,
        error: "Original Password is incorrect, could not update settings!",
        successMessage: ""
      }
    }
    
    existingUser.password = bcrypt.hashSync(newPassword, 12)
  }

  existingUser.username = username

  try {
    await existingUser.save()
  } catch (err) {
    console.log(err)
    return
  }

  session.username = existingUser.username
  session.isLoggedIn = true

  return {
    success: true,
    error: "",
    successMessage: "Details updated successfully!!"
  }
}

module.exports = settings